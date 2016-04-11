from common.models import OfficerAllegation
from mobile.utils.mobile_url_builder import MobileUrlBuilder


class LookupService(object):
    @staticmethod
    def build_url_for_officer_suggestion(suggestion):
        return [MobileUrlBuilder().officer_page(suggestion['meta']['officer'])]

    @staticmethod
    def build_url_for_allegation_suggestion(suggestion):
        allegation = suggestion['meta']['allegation']
        cats = OfficerAllegation.objects.filter(allegation=allegation)\
            .distinct('cat__id').values('cat__id', 'cat__category')
        crid = allegation.crid
        urls = []

        for cat in cats:
            urls.append(MobileUrlBuilder().complaint_page_by_crid_and_category(crid, cat))

        return urls

    @staticmethod
    def url_for_suggestion(suggestion):
        if suggestion['resource'] is 'officer':
            return LookupService.build_url_for_officer_suggestion(suggestion)
        elif suggestion['resource'] is 'officer_allegation':
            # get all the categories and return the urls
            return LookupService.build_url_for_allegation_suggestion(suggestion)

        return []

    @staticmethod
    def url_for(suggestions):
        urls = []

        for suggestion in suggestions:
            urls.extend(LookupService.url_for_suggestion(suggestion))

        return urls
