from django.views.generic import RedirectView
from django.template.defaultfilters import slugify

from common.models import Officer
from share.models import Session


class MobileDataToolView(RedirectView):
    default_redirect_url = '/'

    def get_redirect_url(self, *args, **kwargs):
        hash_id = kwargs.get('hash_id', '')
        try:
            session_id = Session.id_from_hash(hash_id)[0]
        except IndexError:
            return self.default_redirect_url

        try:
            session = Session.objects.get(id=session_id)
        except Session.DoesNotExist:
            return self.default_redirect_url

        filters = session.query.get('filters', {})
        officer_ids = filters.get('officer', {}).get('value', [])
        allegation_crids = filters.get('allegation__crid', {}).get('value', [])

        if len(officer_ids) + len(allegation_crids) == 1:
            if len(officer_ids) == 1:
                officer = Officer.objects.get(pk=officer_ids[0])
                return '/officer/{slug}/{id}'.format(slug=slugify(officer.display_name), id=officer.id)
            else:
                return '/complaint/{crid}'.format(crid=allegation_crids[0])

        return self.default_redirect_url

