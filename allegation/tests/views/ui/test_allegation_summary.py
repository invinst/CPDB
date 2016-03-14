from allegation.factories import OfficerAllegationFactory
from common.tests.core import BaseLiveTestCase
from allegation.tests.utils.allegation_row_helper_mixin import AllegationRowHelperMixin
from common.constants import FINDINGS_DICT, OUTCOMES_DICT


class AllegationSummaryTestCase(AllegationRowHelperMixin, BaseLiveTestCase):
    def test_display_rec_outcome_and_rec_finding(self):
        OfficerAllegationFactory(recc_outcome='002', final_outcome='001', recc_finding='NS', final_finding='SU')
        self.open_complaint_detail()

        # Expand allegation row
        self.find('.complaint-row > .row').click()
        self.find('.allegation-info .rec-finding').text.should.contain(FINDINGS_DICT.get('NS'))
        self.find('.allegation-info .rec-outcome').text.should.contain(OUTCOMES_DICT.get('002'))
