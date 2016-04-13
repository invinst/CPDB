from allegation.factories import InvestigatorFactory
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.services.responses.investigators import InvestigatorResponses


class InvestigatorResponsesTestCase(SimpleTestCase):
    def setUp(self):
        self.investigator = InvestigatorFactory(name='Jason Van Dyke')

        rebuild_index()

    def test_get_instances_from_names(self):
        InvestigatorFactory(name='James Gallah')
        responses = InvestigatorResponses(['Jason Van Dyke', 'invalid'])
        investigators = responses.get_instances_from_names()

        len(investigators).should.equal(1)
        investigators[0].id.should.equal(self.investigator.id)

    def test_get_instances_from_names_not_return_duplicated_officers(self):
        responses = InvestigatorResponses(['Jason Van Dyke', 'jason van dyke'])
        investigators = responses.get_instances_from_names()

        len(investigators).should.equal(1)
        investigators[0].id.should.equal(self.investigator.id)

    def test_get_instances_from_names_only_return_officers_with_exact_name_matched(self):
        responses = InvestigatorResponses(['Jason Van', 'Van Dyke'])
        investigators = responses.get_instances_from_names()

        len(investigators).should.equal(0)
