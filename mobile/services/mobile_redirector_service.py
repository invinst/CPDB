import inspect

from common.models import Officer, Allegation


def active_for(type):
    def active_for_decorator(func):
        def func_wrapper(self):
            if type in self.filters:
                values = [filter_object['value'] for filter_object in self.filters[type]]
                return func(self, values)
            return []

        return func_wrapper

    return active_for_decorator


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
    @active_for('officer')
    def _redirect_officer_id_only_session(self, values):
        officers = Officer.objects.filter(id__in=values)
        return [officer.get_mobile_url() for officer in officers]

    @active_for('officer__star')
    def _redirect_officer_badge_only_session(self, values):
        officers = Officer.objects.filter(star__in=values)
        return [officer.get_mobile_url() for officer in officers]


class AllegationSessionDesktopToMobileRedirector(DesktopToMobileRedirectorMixin):
    @active_for('allegation__crid')
    def _redirect_allegation_crid_only_session(self, values):
        allegations = Allegation.objects.filter(crid__in=values)
        return [allegation.get_mobile_url() for allegation in allegations]


class DesktopToMobileRedirectorService(object):
    def __init__(self, redirectors):
        self.redirectors = redirectors or []

    def register(self, redirector):
        self.redirectors.append(redirector)

    def unregister(self, redirector):
        self.redirectors.remove(redirector)

    def perform(self, filters):
        redirect_urls = []
        [redirect_urls.extend(redirector(filters).redirect_url()) for redirector in self.redirectors]
        return redirect_urls
