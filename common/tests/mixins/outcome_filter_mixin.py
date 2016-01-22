from common.tests.core import BaseLiveTestCase


class OutcomeFilterTestMixin(BaseLiveTestCase):
    def get_outcome_tab_count(self):
        return len(self.find_all('.filters > span'))

    def get_outcome_tab_at(self, position):
        return self.find_all('.filters > span')[position]

    def assert_number_of_complaints_in_tab(self, numbers, position):
        self.get_outcome_tab_at(position).click()
        len(self.find_all('.complaint-row')).should.equal(numbers)
