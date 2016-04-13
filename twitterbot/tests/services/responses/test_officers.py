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
        responses = OfficerResponses(['Jason Van Dyke', 'invalid'])
        officers = responses.get_instances_from_names()

        len(officers).should.equal(1)
        officers[0].id.should.equal(self.officer.id)

    def test_get_instances_from_names_not_return_duplicated_officers(self):
        responses = OfficerResponses(['Jason Van Dyke', 'jason van dyke'])
        officers = responses.get_instances_from_names()

        len(officers).should.equal(1)
        officers[0].id.should.equal(self.officer.id)

    def test_get_instances_from_names_only_return_officers_with_exact_name_matched(self):
        responses = OfficerResponses(['Jason Van', 'Van Dyke'])
        officers = responses.get_instances_from_names()

        len(officers).should.equal(0)
