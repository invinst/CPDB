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
        responses_builder = OfficerResponses(['Jason Van Dyke', 'invalid'])
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(1)
        responses[0].entity.id.should.equal(self.officer.id)

    def test_get_instances_from_names_not_return_duplicated_officers(self):
        responses_builder = OfficerResponses(['Jason Van Dyke', 'jason van dyke'])
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(1)
        responses[0].entity.id.should.equal(self.officer.id)

    def test_get_instances_from_names_only_return_officers_with_exact_name_matched(self):
        responses_builder = OfficerResponses(['Jason Van', 'Van Dyke'])
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(0)
