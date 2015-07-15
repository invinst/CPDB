import random


from common.tests.core import *
from allegation.factories import AllegationFactory, AllegationCategoryFactory
from common.models import Allegation


FILTERS = {
    'Unknown': ['UN', 'NC', 'NA', 'DS'],
    'Exonerated': ['EX'],
    'Sustained': ['SU'],
    'Not Sustained': ['NS']
}
OUTCOME_CLASS = ['sustained', 'open-investigation', 'disciplined']


class AllegationFilterTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        for filter in FILTERS:
            for final_finding in FILTERS[filter]:
                # Make sure it doesn't break the disciplined test
                AllegationFactory(final_finding=final_finding, cat=self.allegation_category,
                                  final_outcome_class=random.choice(OUTCOME_CLASS))

    def test_filter_by_final_finding(self):
        self.visit('/')

        # Check all
        self.link(self.allegation_category.category).click()
        self.until(lambda : self.element_exist('.complaint-row'))
        self.number_of_complaints().should.equal(7)

        # On each filter
        for filter in FILTERS:
            self.element_by_tagname_and_text('span', filter).click()
            number_of_final_findings = len(FILTERS[filter])
            self.number_of_complaints().should.equal(number_of_final_findings)

        # Disciplined filter
        self.element_by_tagname_and_text('span', 'Disciplined').click()
        self.number_of_complaints().should.equal(Allegation.objects.filter(final_outcome_class='disciplined').count())

    def number_of_complaints(self):
        return len(self.find_all('.complaint-row'))
