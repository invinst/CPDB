import inspect

from common.models import Officer, Allegation


class DesktopToMobileRedirectorMixin(object):
    def __init__(self, filters):
        self.filters = filters

    def redirect_url(self):
        results = []
        for name, func in inspect.getmembers(self, predicate=inspect.ismethod):
            if name.startswith('_redirect'):
                results.extend(func())
        return results


class OfficerSessionDesktopToMobileRedirector(DesktopToMobileRedirectorMixin):
    def _redirect_officer_id_only_session(self):
        if 'officer' in self.filters:
            values = self.filters['officer'].get('value', [])
            officers = Officer.objects.filter(id__in=values)
            return [officer.get_mobile_url() for officer in officers]
        return []

    def _redirect_officer_badge_only_session(self):
        if 'officer__star' in self.filters:
            values = self.filters['officer__star'].get('value', [])
            officers = Officer.objects.filter(star__in=values)
            return [officer.get_mobile_url() for officer in officers]
        return []


class AllegationSessionDesktopToMobileRedirector(DesktopToMobileRedirectorMixin):
    def _redirect_allegation_crid_only_session(self):
        if 'allegation__crid' in self.filters:
            values = self.filters['allegation__crid'].get('value', [])
            allegations = Allegation.objects.filter(crid__in=values)
            return [allegation.get_mobile_url() for allegation in allegations]
        return []


class DesktopToMobileRedirectorService(object):
    def __init__(self):
        self.redirectors = [
            OfficerSessionDesktopToMobileRedirector,
            AllegationSessionDesktopToMobileRedirector
        ]

    def register(self, redirector):
        self.redirectors.append(redirector)

    def unregister(self, redirector):
        self.redirectors.remove(redirector)

    def perform(self, filters):
        redirect_urls = []
        [redirect_urls.extend(redirector(filters).redirect_url()) for redirector in self.redirectors]
        return redirect_urls
