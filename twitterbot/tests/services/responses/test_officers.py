from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.services.responses.officers import OfficerResponses


class OfficerResponsesTestCase(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory(officer_first='Jason', officer_last='Van Dyke')

        rebuild_index()

    def test_get_instances_from_names(self):
        OfficerFactory(officer_first='James', officer_last='Gallah')
        names = {
            'Jason Van Dyke': [],
            'invalid': []
        }
        responses_builder = OfficerResponses(names)
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(1)
        responses[0].entity.id.should.equal(self.officer.id)

    def test_get_instances_from_names_not_return_duplicated_officers(self):
        names = {
            'Jason Van Dyke': [],
            'jason van dyke': []
        }
        responses_builder = OfficerResponses(names)
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(1)
        responses[0].entity.id.should.equal(self.officer.id)

    def test_get_instances_from_names_only_return_officers_with_exact_name_matched(self):
        names = {
            'Jason Van': [],
            'Van Dyke': []
        }
        responses_builder = OfficerResponses(names)
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(0)
