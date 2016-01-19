from django.template.defaultfilters import slugify

from common.models import Officer, Allegation
from share.models import Session


class MobileDataToolService(object):
    default_redirect_url = '/mobile'

    def __init__(self, hash_id=''):
        try:
            session_id = Session.id_from_hash(hash_id)[0]
            session = Session.objects.get(id=session_id)
            self.filters = session.query.get('filters', {})
        except (IndexError, Session.DoesNotExist):
            self.filters = {}

    def fetch_filters(self, field):
        values = self.filters.get(field, {}).get('value', [])
        if len(values) == 1:
            return values[0]

        return None

    def direct_url_from_officer(self, officer):
        return '/mobile/officer/{slug}/{id}'.format(slug=slugify(officer.display_name), id=officer.id)

    def redirect_url_from_officer_id(self):
        officer_id = self.fetch_filters('officer')
        try:
            officer = Officer.objects.get(pk=officer_id)
        except Officer.DoesNotExist:
            return None

        return self.direct_url_from_officer(officer)

    def redirect_url_from_officer_star(self):
        officer_star = self.fetch_filters('officer__star')
        if not officer_star:
            return None
        try:
            officer = Officer.objects.get(star=officer_star)
        except Officer.DoesNotExist:
            return None

        return self.direct_url_from_officer(officer)

    def redirect_url_from_allegation(self):
        allegation_crid = self.fetch_filters('allegation__crid')
        if allegation_crid:
            return '/mobile/complaint/{crid}'.format(crid=allegation_crid)
        return None

    def redirect_url(self):
        redirect_urls = [x for x in [
            self.redirect_url_from_officer_id(),
            self.redirect_url_from_officer_star(),
            self.redirect_url_from_allegation(),
        ] if x is not None]

        if len(redirect_urls) == 1:
            return redirect_urls[0]

        return self.default_redirect_url
