import json

from django.conf import settings
from django.db.models import Count
from django.db.models.query_utils import Q
from django.http.response import HttpResponse, Http404
from django.shortcuts import get_object_or_404, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.generic import View
from django.views.generic import TemplateView
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

from common.json_serializer import JSONSerializer
from common.models import Allegation, Area, AllegationCategory, Officer
from common.models import NO_DISCIPLINE_CODES, ComplainingWitness, PoliceWitness
from share.models import Session


class AllegationListView(TemplateView):
    template_name = 'allegation/home.html'
    session = None

    def get_filters(self, key, values):
        if key == 'officer':
            values = Officer.objects.filter(pk__in=values['value'])
            values = [o.tag_value for o in values]
        elif key == 'cat':
            values = AllegationCategory.objects.filter(pk__in=values['value'])
            values = [o.tag_value for o in values]
        elif key == 'areas__id':
            return False
        else:
            values = values['value']
        return values

    def get_context_data(self, **kwargs):
        context = super(AllegationListView, self).get_context_data(**kwargs)
        context['show_site_title'] = True
        if self.session:
            filters = {}
            save_filters = self.session.query.get('filters', {})
            for key in save_filters:
                values = save_filters[key]
                values = self.get_filters(key, values)
                if values:
                    filters.update({
                        key: values
                    })
            context['filters'] = filters
        context['session'] = self.session
        return context

    def get(self, request, hash_id=None, *args, **kwargs):
        if hash_id:
            ints = Session.id_from_hash(hash_id)
            owned_sessions = request.session.get('owned_sessions', [])
            if ints:
                session_id = ints[0]
                session = get_object_or_404(Session, pk=session_id)
                if session_id not in owned_sessions:
                    new_session = session.clone()
                    self.session = new_session

                    owned_sessions.append(new_session.id)
                    request.session['owned_sessions'] = owned_sessions
                    request.session.modified = True

                    return redirect(new_session)
                else:
                    self.session = session
            else:
                raise Http404()

        return super(AllegationListView, self).get(request, *args, **kwargs)

    def post(self, request, hash_id):
        ints = Session.id_from_hash(hash_id)
        session_id = ints[0]

        owned_sessions = request.session.get('owned_sessions', [])
        if session_id not in owned_sessions:
            raise Http404()

        session = get_object_or_404(Session, pk=session_id)

        data = json.loads(request.body.decode())
        query = session.query or {}
        query.update(data)

        session.query = query

        session.save()

        return HttpResponse(JSONSerializer().serialize({
            'success': True
        }), content_type='application/json')

class AreaAPIView(View):
    def get(self, request):
        areas = Area.objects.all().exclude(type='school-grounds')
        type_filter = request.GET.get('type')

        if type_filter:
            areas = areas.filter(type=type_filter)

        area_dict = {
            "type": "FeatureCollection",
            "features": [],
        }
        for area in areas:
            polygon = None
            if area.polygon:
                polygon = json.loads(area.polygon.geojson)
            if not polygon:
                continue
            area_json = {
                "type": "Feature",
                "properties": {
                    'id': area.id,
                    'name': area.name,
                    'type': area.type,
                },
                'geometry': polygon
            }

            area_dict['features'].append(area_json)
        content = json.dumps(area_dict)
        return HttpResponse(content)


class AllegationAPIView(View):
    def __init__(self, **kwargs):
        super(AllegationAPIView, self).__init__(**kwargs)
        self.filters = {}
        self.conditions = []
        self.years = []
        self.months = []
        self.days = []

    def add_filter(self, field):
        value = self.request.GET.getlist(field)

        if len(value) > 1:
            self.filters["%s__in" % field] = value

        elif value:
            self.filters[field] = value[0]

    def add_date_filter(self, field):
        condition = Q()

        field_name = '%s__range' % field
        date_ranges = self.request.GET.getlist(field_name)

        field_name = '%s__year' % field
        years = self.request.GET.getlist(field_name)

        field_name = '%s__year_month' % field
        year_months = self.request.GET.getlist(field_name)

        dates = self.request.GET.getlist(field)
        for date_range in date_ranges:
            date_range = date_range.split(',')
            condition = condition | Q(**{'%s__range' % field: date_range})
        for year in years:
            condition = condition | Q(**{"%s__year" % field: year})

        for year_month in year_months:
            year, month = year_month.split('-')
            condition = condition | Q(Q(**{"%s__year" % field: year}) & Q(**{"%s__month" % field: month}))

        formatted_dates = []
        for date in dates:
            formatted_dates.append(date.replace('/','-'))

        if dates:
            condition = condition | Q(**{"%s__in" % field: formatted_dates})

        self.conditions.append(condition)

    def get_allegations(self, ignore_filters=None):
        filters = ['crid', 'areas__id', 'cat', 'neighborhood_id', 'recc_finding', 'final_outcome',
                   'recc_outcome', 'final_finding', 'officer', 'officer__star', 'investigator',
                   'cat__category']

        if ignore_filters:
            filters = [x for x in filters if x not in ignore_filters]

        if 'cat' in filters and 'cat__category' in filters:
            if 'cat__category' in self.request.GET:
                if 'cat' in self.request.GET:
                    category_names = self.request.GET.getlist('cat__category')
                    categories = AllegationCategory.objects.filter(category__in=category_names)
                    cats = list(categories.values_list('cat_id', flat=True))
                    value = self.request.GET.getlist('cat') + cats
                    self.filters['cat__in'] = value
                    filters.remove('cat')
                    filters.remove('cat__category')

        date_filters = ['incident_date_only']

        for filter_field in filters:
            self.add_filter(filter_field)

        for date_filter in date_filters:
            self.add_date_filter(date_filter)

        allegations = Allegation.objects.filter(*self.conditions, **self.filters)
        if 'officer_name' in self.request.GET:
            names = self.request.GET.getlist('officer_name')
            for name in names:
                parts = name.split(' ')
                if len(parts) > 1:
                    cond = Q(officer__officer_first__istartswith=parts[0])
                    cond = cond | Q(officer__officer_last__istartswith=" ".join(parts[1:]))
                else:
                    cond = Q(officer__officer_first__istartswith=name) | Q(officer__officer_last__istartswith=name)
                allegations = allegations.filter(cond)

        if 'latlng' in self.request.GET:
            latlng = self.request.GET['latlng'].split(',')
            if len(latlng) == 2:
                radius = self.request.GET.get('radius', 500)
                point = Point(float(latlng[1]), float(latlng[0]))
                allegations = allegations.filter(point__distance_lt=(point, D(m=radius)))

        return allegations

    def get(self, request):
        allegations = self.get_allegations()
        allegations = allegations.order_by('-incident_date', '-start_date', 'crid')

        try:
            start = int(request.GET.get('start', 0))
        except ValueError:
            start = 0

        length = getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 200)
        try:
            length = int(request.GET.get('length', length))
        except ValueError:
            pass

        allegations = allegations.select_related('cat')

        display_allegations = allegations[start:start + length]
        allegations_list = []

        for allegation in display_allegations:
            category = None
            if allegation.cat:
                category = allegation.cat

            witness = ComplainingWitness.objects.filter(crid=allegation.crid)
            police_witness = PoliceWitness.objects.filter(crid=allegation.crid)

            allegation.final_finding = allegation.get_final_finding_display()
            allegation.final_outcome = allegation.get_final_outcome_display()
            allegation.recc_finding = allegation.get_recc_finding_display()
            allegation.recc_outcome = allegation.get_recc_outcome_display()

            officer_ids = Allegation.objects.filter(crid=allegation.crid).values('officer')
            officers = Officer.objects.filter(pk__in=officer_ids)
            if allegation.officer:
                officers = officers.exclude(pk=allegation.officer.pk)
            officers = officers.order_by('-allegations_count')

            ret = {
                'allegation': allegation,
                'officers': officers,
                'category': category,
                'officer': allegation.officer,
                'complaining_witness': witness,
                'police_witness': police_witness,
            }
            allegations_list.append(ret)

        content = JSONSerializer().serialize({
            'allegations': allegations_list,
            'iTotalRecords': Allegation.objects.all().count(),
            'iTotalDisplayRecords': allegations.count(),
        })
        return HttpResponse(content)


class AllegationGISApiView(AllegationAPIView):
    def get(self, request):
        seen_crids = {}
        allegations = self.get_allegations(ignore_filters=['areas__id'])
        allegation_dict = {
            "type": "FeatureCollection",
            "features": [],
        }
        for allegation in allegations:
            if allegation.crid in seen_crids:
                continue
            seen_crids[allegation.crid] = True
            point = None
            if allegation.point:
                point = json.loads(allegation.point.geojson)

            allegation_json = {
                "type": "Feature",
                "properties": {
                    "name": allegation.crid,
                },
                'geometry': point
            }
            if allegation.cat:
                allegation_json['properties']['type'] = allegation.cat.allegation_name,
            allegation_dict['features'].append(allegation_json)

        content = json.dumps(allegation_dict)
        return HttpResponse(content)


class AllegationSummaryApiView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations(ignore_filters=['cat', 'cat__category'])

        count_query = allegations.values_list('cat').annotate(dcount=Count('id'))
        count_by_category = dict(count_query)

        discipline_allegations = allegations.exclude(final_outcome__in=NO_DISCIPLINE_CODES)
        discipline_count_query = discipline_allegations.values_list('cat').annotate(dcount=Count('id'))
        discipline_count_by_category = dict(discipline_count_query)
        categories = AllegationCategory.objects.all().order_by('category')

        summary = []
        summary_map_by_name = {}

        for category in categories:
            if category.category in summary_map_by_name:
                summary_value = summary_map_by_name[category.category]
            else:
                summary_value = summary_map_by_name[category.category] = {
                    'name': category.category,
                    'total': 0,
                    'count': 0,
                    'subcategories': []
                }
                summary.append(summary_value)

            count = count_by_category.get(category.cat_id, 0)
            summary_value['total'] += count
            summary_value['count'] += discipline_count_by_category.get(category.cat_id, 0)
            summary_value['subcategories'].append({
                'name': category.allegation_name,
                'cat_id': category.cat_id,
                'count': count
            })

        summary = sorted(summary, key=lambda x: -x['total'])

        maximum = summary[0]['total'] or 1
        for value in summary:
            value['percentToMax'] = value['total'] * 100.0 / maximum

        content = JSONSerializer().serialize({
            'summary': summary
        })
        return HttpResponse(content, content_type="application/json")


class OfficerListAPIView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations()
        officers = allegations.values_list('officer', flat=True).distinct()
        officers = Officer.objects.filter(pk__in=officers).order_by('-allegations_count')

        if 'allegations_count_start' in request.GET:
            officers = officers.filter(allegations_count__gt=int(request.GET['allegations_count_start']))
        if 'allegations_count_end' in request.GET:
            officers = officers.filter(allegations_count__lte=int(request.GET['allegations_count_end']))

        officer_list_length = officers.count()

        num_to_send = settings.OFFICER_LIST_SEND_LENGTH
        if officer_list_length > num_to_send:
            officers = officers[0:num_to_send]

        content = JSONSerializer().serialize({
            'officers': officers
        })
        return HttpResponse(content, content_type="application/json")


class InvestigationAPIView(View):
    def get(self, request):
        crid = request.GET.get('crid')
        ret = {}
        if crid:
            allegations = Allegation.objects.filter(crid=crid)
            allegation_officers = Officer.objects.filter(pk__in=allegations.values('officer'))
            allegation = allegations[0]
            investigator = allegation.investigator

            ret['investigation'] = []
            for officer in allegation_officers:
                complaints = Allegation.objects.filter(officer=officer, investigator=investigator)
                num_investigated = complaints.count()
                no_action_taken_count = complaints.filter(final_outcome__in=NO_DISCIPLINE_CODES).count()
                ret['investigation'].append({
                    'count': num_investigated,
                    'no_action_taken_count': no_action_taken_count,
                    'officer': officer,
                })

            ret['police_witness'] = []
            for witness in PoliceWitness.objects.filter(crid=crid):
                officers = []
                witness.officer_name = "%s %s" % (witness.officer.officer_first, witness.officer.officer_last)
                for officer in allegation_officers:
                    complaints = Allegation.objects.filter(officer__in=(officer.id, witness.officer_id))
                    num_complaints = complaints.count()
                    no_action_taken_count = complaints.filter(final_outcome__in=NO_DISCIPLINE_CODES).count()
                    officers.append({
                        'num_complaints': num_complaints,
                        'no_action_taken': no_action_taken_count,
                        'officer': officer,
                    })
                ret['police_witness'].append({
                    'witness': witness,
                    'witness_officer': witness.officer,
                    'officers': officers,
                })

            ret['complaint_witness'] = ComplainingWitness.objects.filter(crid=crid)

        content = JSONSerializer().serialize(ret)
        return HttpResponse(content, content_type="application/json")


class AllegationChartApiView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations()

        count_query = allegations.values_list('cat__category').annotate(dcount=Count('id'))
        count_by_category = dict(count_query)

        discipline_allegations = allegations.exclude(final_outcome__in=NO_DISCIPLINE_CODES)
        discipline_count_query = discipline_allegations.values_list('cat__category').annotate(dcount=Count('id'))
        discipline_count_by_category = dict(discipline_count_query)

        data = []

        for category in count_by_category:
            not_disciplines = discipline_count_by_category.get(category, 0)
            row = {
                'name': category,
                'total': count_by_category[category],
                'drilldown': {
                    'name': 'Result',
                    'categories': ['Disciplines', 'Not Disciplines'],
                    'data': [count_by_category[category] - not_disciplines, not_disciplines],
                }
            }
            data.append(row)

        content = JSONSerializer().serialize({
            'data': data
        })
        return HttpResponse(content, content_type="application/json")
