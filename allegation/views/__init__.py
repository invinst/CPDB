import csv
import io
import json

from django.conf import settings
from django.contrib.gis.geos.factory import fromstr
from django.db import connection
from django.db.models import Count
from django.http.response import HttpResponse, Http404
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import TemplateView
from django.views.generic import View

from allegation.views.allegation_api_view import AllegationAPIView
from api.models import Setting
from common.json_serializer import JSONSerializer
from common.models import Allegation, Area, AllegationCategory, Investigator, Officer, GENDER_DICT, OUTCOME_TEXT_DICT, \
    FINAL_FINDING_TEXT_DICT
from common.models import ComplainingWitness, NO_DISCIPLINE_CODES, PoliceWitness
from share.models import Session


OFFICER_COMPLAINT_COUNT_RANGE = [
    [20, 0],  # x >= 9
    [9, 20],  # 3 <= x < 9
    [3, 9],  # 2 <= x < 3
    [2, 3],  # 1 <= x < 2
    [0, 2],  # x == 0
]
OFFICER_COMPLAINT_COUNT_RANGE = getattr(settings, 'OFFICER_COMPLAINT_COUNT_RANGE', OFFICER_COMPLAINT_COUNT_RANGE)


class AllegationListView(TemplateView):
    template_name = 'allegation/index.html'
    session = None

    def get_context_data(self, **kwargs):
        context = super(AllegationListView, self).get_context_data(**kwargs)
        admin_settings = Setting.objects.first()
        context.update({'admin_settings': admin_settings})
        return context

    def get(self, request, hash_id=None, *args, **kwargs):
        return super(AllegationListView, self).get(request, *args, **kwargs)




class AreaAPIView(View):
    def get(self, request):
        areas = Area.objects.all()
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


class AllegationClusterApiView(AllegationAPIView):

    def get(self, request):
        areas = request.GET.getlist('areas__id')
        ignore_filters = ['areas__id']
        if areas:
            self.orig_query_dict = request.GET.copy()
            schools = Area.objects.filter(pk__in=areas, type='school-grounds')
            areas = list(schools.values_list('pk', flat=True))
            if areas:
                self.orig_query_dict.setlist('areas__id', areas)
                ignore_filters = []
        allegations = self.get_allegations(ignore_filters=ignore_filters)
        allegation_pks = list(allegations.values_list('id', flat=True))
        ret = {'features': [], 'type': 'FeatureCollection'}

        if len(allegation_pks) > 0:
            allegation_pks = ",".join(str(x) for x in allegation_pks)
            kursor = connection.cursor()

            grid_size = 0.0005

            kursor.execute('''
                SELECT
                    COUNT( point ) AS count,
                    ST_AsText( ST_Centroid(ST_Collect( point )) ) AS center
                FROM common_allegation WHERE point IS NOT NULL and id in (%s)
                GROUP BY
                    ST_SnapToGrid( ST_SetSRID(point, 4326), %s, %s)
                ''' % (allegation_pks, grid_size, grid_size)
                           )
            kclusters = kursor.fetchall()

            for cluster in kclusters:
                point = fromstr(cluster[1])
                allegation_json = {
                    "type": "Feature",
                    "properties": {
                        "name": cluster[0],
                    },
                    'geometry': {
                        'coordinates': [point.x, point.y],
                        'type': 'Point'
                    }
                }
                ret['features'].append(allegation_json)

        content = json.dumps(ret)
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
                    'subcategories': [],
                    'id': len(summary) + 1,
                }
                summary.append(summary_value)

            count = count_by_category.get(category.cat_id, 0)
            summary_value['total'] += count
            summary_value['count'] += discipline_count_by_category.get(category.cat_id, 0)
            summary_value['subcategories'].append({
                'name': category.allegation_name,
                'cat_id': category.cat_id,
                'count': count,
            })

        summary = sorted(summary, key=lambda x: -x['total'])
        for summary_row in summary:
            summary_row['subcategories'] = sorted(summary_row['subcategories'], key=lambda x: -x['count'])

        maximum = summary[0]['total'] if summary else 1
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
        officers = list(officers)  # to solve multiple subquery problem
        officers = Officer.objects.filter(pk__in=officers).order_by('-allegations_count')

        overview = []
        for r in OFFICER_COMPLAINT_COUNT_RANGE:
            range_officers = officers.filter(allegations_count__gte=r[0])
            if r[1]:
                range_officers = range_officers.filter(allegations_count__lt=r[1])
            overview.append(range_officers.count())

        content = JSONSerializer().serialize({
            'officers': officers,
            'overview': overview,
        })
        return HttpResponse(content, content_type="application/json")


class InvestigationAPIView(View):
    def get(self, request):
        crid = request.GET.get('crid')
        ret = {}
        if crid:
            allegations = Allegation.objects.filter(crid=crid)
            allegation_officers = Officer.objects.filter(pk__in=allegations.values('officer'))

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


class AllegationCSVView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations()
        output = io.StringIO()
        writer = csv.writer(output, dialect='excel')
        writer.writerow(["Unique id", "Observation date", "Latitude", "Longitude"])
        for allegation in allegations:

            date = allegation.incident_date
            if not date or date.year <= 1970:
                date = allegation.start_date
            else:
                date = date.date()

            location = False
            if not allegation.point or not date:
                continue

            writer.writerow([allegation.pk, date, allegation.point.y, allegation.point.x])
        output.seek(0)
        return HttpResponse(output.read(), content_type='text/csv')
