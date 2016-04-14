from allegation.factories import OfficerFactory, AllegationFactory, AllegationCategoryFactory, OfficerAllegationFactory
from common.services.lookup_service import LookupService
from common.tests.core import SimpleTestCase


class LookupServiceTest(SimpleTestCase):
    def build_allegation_suggestion(self, allegation):
        return {
            'text': allegation.crid,
            'resource': 'officer_allegation',
            'url': [],
            'resource_key': allegation.crid,
            'meta': {
                'allegation': allegation
            }
        }

    def build_officer_suggestion(self, officer):
        return {
            'text': officer.display_name,
            'resource': 'officer',
            'url': [],
            'resource_key': officer.pk,
            'meta': {
                'officer': officer
            }
        }

    def setUp(self):
        officer = OfficerFactory(id=10, officer_first='first', officer_last='last')
        self.officer_url = '/officer/first-last/10'
        self.officer_suggestion = self.build_officer_suggestion(officer)

        allegation = AllegationFactory(crid='12345')
        category = AllegationCategoryFactory(pk=123456, category='category name')
        OfficerAllegationFactory(allegation=allegation, cat=category)
        self.allegation_url = '/complaint/12345/category-name/x8G40LjV'
        self.allegation_suggestion = self.build_allegation_suggestion(allegation)

    def test_build_url_for_officer_suggestion(self):
        LookupService.build_url_for_officer_suggestion(self.officer_suggestion).should.be.equal([self.officer_url])

    def test_build_url_for_allegation_suggestion(self):
        LookupService.build_url_for_allegation_suggestion(self.allegation_suggestion)\
            .should.be.equal([self.allegation_url])

    def test_url_for_suggestion_with_officer_resource(self):
        LookupService.url_for_suggestion(self.officer_suggestion).should.be.equal([self.officer_url])

    def test_url_for_suggestion_with_allegation_resource(self):
        LookupService.url_for_suggestion(self.allegation_suggestion).should.be.equal([self.allegation_url])

    def test_url_for_suggestion_with_invalid_resource(self):
        suggestion = {'resource': 'invalid'}
        LookupService.url_for_suggestion(suggestion).should.be.equal([])

    def test_url_for_multiple_suggestions(self):
        LookupService.url_for([self.allegation_suggestion, self.officer_suggestion])\
            .should.be.equal([self.allegation_url, self.officer_url])
