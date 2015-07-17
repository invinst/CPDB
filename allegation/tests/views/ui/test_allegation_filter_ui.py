from common.tests.core import *
from allegation.factories import AllegationFactory, AllegationCategoryFactory


FILTERS = {
    'Unknown': ['UN', 'NC', 'NA', 'DS'],
    'Exonerated': ['EX'],
    'Sustained': ['SU'],
    'Not Sustained': ['NS']
}


class AllegationFilterTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        for filter in FILTERS:
            for final_finding in FILTERS[filter]:
                AllegationFactory(final_finding=final_finding, cat=self.allegation_category)

    def test_filter_by_final_finding(self):
        self.visit('/')

        # Check all
        self.link(self.allegation_category.category).click()
        self.until(lambda : self.element_exist('.complaint-row'))
        number_of_complaints = len(self.find_all('.complaint-row'))
        number_of_complaints.should.equal(7)

        # On each filter
        for filter in FILTERS:
            self.element_by_tagname_and_text('span', filter).click()
            number_of_final_findings = len(FILTERS[filter])
            number_of_complaints = len(self.find_all('.complaint-row'))
            number_of_complaints.should.equal(number_of_final_findings)
