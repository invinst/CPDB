from allegation.factories import AllegationFactory, OfficerFactory, PoliceWitnessFactory
from common.models import UNITS
from common.tests.core import BaseLiveTestCase


class OfficerDetailPageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.rank = 'SGT'
        self.star = '823'
        self.unit = '001'
        self.gender = 'M'
        self.crid_1 = '1234'
        self.crid_2 = '2345'
        self.crid_3 = '3456'

        self.officer = OfficerFactory(rank=self.rank, star=self.star, unit=self.unit, gender=self.gender)
        self.involved_officer = OfficerFactory()
        self.witness_officer = OfficerFactory()

        AllegationFactory(officer=self.officer, crid=self.crid_1)
        AllegationFactory(officer=self.officer, crid=self.crid_2)
        AllegationFactory(officer=self.officer, crid=self.crid_3)
        AllegationFactory(officer=self.involved_officer, crid=self.crid_1)
        PoliceWitnessFactory(officer=self.witness_officer, crid=self.crid_2)

    def test_click_to_officer_card_lead_to_detail_page_with_basic_information_about_officer(self):
        units = dict(UNITS)
        unit_name = units[self.unit]
        self.go_to_officer_detail_page(self.officer)
        self.until(self.ajax_complete)

        self.until(lambda: self.should_see_text(self.unit))

        content = self.find("body").text
        content.should.contain(unit_name)
        content.should.contain(self.star)
        content.should.contain('Sergeant')
        content.should.contain('Male')

    def test_filter_by_intersected_officer(self):
        self.go_to_officer_detail_page(self.officer)

        # integrity check
        self.until(self.ajax_complete)
        self.number_of_complaints().should.equal(3)

        for officer in [self.involved_officer, self.witness_officer]:
            checkmark = "#officer_%s .checkmark" % officer.id
            self.find(checkmark).click()
            self.number_of_complaints().should.equal(1)
            self.find(checkmark).click()

        # Click two of them return all the complaints that the officer is involved or witnessed
        for officer in [self.involved_officer, self.witness_officer]:
            checkmark = "#officer_%s .checkmark" % officer.id
            self.find(checkmark).click()

        self.number_of_complaints().should.equal(2)

    def go_to_officer_detail_page(self, officer):
        self.visit('/')
        self.find('#officer_%s .officer-link' % officer.id).click()

    def number_of_complaints(self):
        return len(self.find_all('.complaint-row'))
