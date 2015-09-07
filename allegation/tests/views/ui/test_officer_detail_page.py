from allegation.factories import AllegationFactory, OfficerFactory, PoliceWitnessFactory
from common.tests.core import BaseLiveTestCase


class OfficerDetailPageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.rank = 'SGT'
        self.star = '823'
        self.unit = '212'
        self.gender = 'M'
        self.crid = '1234'
        self.other_crid ='2345'

        self.officer = OfficerFactory(rank=self.rank, star=self.star, unit=self.unit, gender=self.gender)
        self.involved_officer = OfficerFactory()
        self.witness_officer = OfficerFactory()
        AllegationFactory(officer=self.officer, crid=self.crid)
        AllegationFactory(officer=self.officer, crid=self.other_crid)
        AllegationFactory(officer=self.involved_officer, crid=self.crid)
        PoliceWitnessFactory(officer=self.witness_officer, crid=self.crid)

    def test_click_to_officer_card_lead_to_detail_page_with_basic_information_about_officer(self):
        self.go_to_officer_detail_page(self.officer)

        self.should_see_text('Unit %s' % self.unit)
        self.should_see_text('Star %s' % self.star)
        self.should_see_text('Rank %s' % 'Sergeant')
        self.should_see_text('Sex %s' % 'Male')

    def test_officer_page_check_to_officer_to_filter_by_intersected(self):
        self.go_to_officer_detail_page(self.officer)
        
        for officer in [self.involved_officer, self.witness_officer]:
            checkmark = "#officer_%s .checkmark" % officer.id
            self.find(checkmark).click()
            self.number_of_complaints().should.equal(1)
            self.find(checkmark).click()

    def go_to_officer_detail_page(self, officer):
        self.visit('/')
        self.find('#officer_%s .officer-link' % officer.id).click()
    
    def number_of_complaints(self):
        return len(self.find_all('.complaint-row'))
