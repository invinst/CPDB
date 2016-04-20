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
        names = {
            'Jason Van Dyke': [],
            'invalid': []
        }
        responses_builder = InvestigatorResponses(names)
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(1)
        responses[0].entity.id.should.equal(self.investigator.id)

    def test_get_instances_from_names_not_return_duplicated_officers(self):
        names = {
            'Jason Van Dyke': [],
            'jason van dyke': []
        }
        responses_builder = InvestigatorResponses(names)
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(1)
        responses[0].entity.id.should.equal(self.investigator.id)

    def test_get_instances_from_names_only_return_officers_with_exact_name_matched(self):
        names = {
            'Jason Van': [],
            'Van Dyke': []
        }
        responses_builder = InvestigatorResponses(names)
        responses = responses_builder.get_instances_from_names()

        len(responses).should.equal(0)
