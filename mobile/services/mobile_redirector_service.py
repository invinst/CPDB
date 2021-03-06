import inspect

from common.models import Officer, Allegation, OfficerAllegation
from mobile.utils.mobile_url_builder import MobileUrlBuilder


def active_for(types):
    def active_for_decorator(func):
        def func_wrapper(self):
            values = {}
            filter_list = [a_filter for a_filter in self.filters]

            if sorted(filter_list) == sorted(types):
                for a_type in types:
                    values[a_type] = [filter_object['value'] for filter_object in self.filters[a_type]]
                return func(self, **values)
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
    @active_for(['officer'])
    def _redirect_officer_id_only_session(self, officer):
        officers = Officer.objects.filter(id__in=officer)
        return [MobileUrlBuilder().officer_page(an_officer) for an_officer in officers]

    @active_for(['officer__star'])
    def _redirect_officer_badge_only_session(self, officer__star):
        officers = Officer.objects.filter(star__in=officer__star)
        return [MobileUrlBuilder().officer_page(officer) for officer in officers]


class AllegationSessionDesktopToMobileRedirector(DesktopToMobileRedirectorMixin):
    @active_for(['allegation__crid'])
    def _redirect_allegation_crid_only_session(self, allegation__crid):
        allegations = Allegation.objects.filter(crid__in=allegation__crid)
        officer_allegations = OfficerAllegation.objects.filter(allegation__crid__in=allegation__crid)
        cats = officer_allegations.distinct('cat__id').values('cat__id')

        if len(officer_allegations) == 1 or len(cats) == 1:
            return [MobileUrlBuilder().complaint_page(officer_allegations[0])]

        return ['/s/{crid}'.format(crid=allegation.crid) for allegation in allegations]

    @active_for(['allegation__crid', 'cat'])
    def _redirect_allegation_crid_and_cat_session(self, allegation__crid=None, cat=None):
        officer_allegations = OfficerAllegation.objects.filter(cat__in=cat,
                                                               allegation__crid__in=allegation__crid)
        return [MobileUrlBuilder().complaint_page(officer_allegation) for officer_allegation in officer_allegations]


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
