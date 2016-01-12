from allegation.factories import (
    AllegationFactory, OfficerFactory, PoliceWitnessFactory,
    OfficerAllegationFactory)
from allegation.tests.constants import TEST_DOCUMENT_URL
from common.models import UNITS
from common.tests.core import BaseLiveTestCase
from officer.factories import StoryFactory


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

        allegation_1 = AllegationFactory(crid=self.crid_1)
        OfficerAllegationFactory(
            officer=self.officer,
            allegation=allegation_1)
        allegation_2 = AllegationFactory(crid=self.crid_2)
        OfficerAllegationFactory(officer=self.officer, allegation=allegation_2)
        OfficerAllegationFactory(
            officer=self.officer,
            allegation=AllegationFactory(crid=self.crid_3))
        OfficerAllegationFactory(
            officer=self.involved_officer,
            allegation=allegation_1)
        PoliceWitnessFactory(
            officer=self.witness_officer, crid=self.crid_2,
            allegation=allegation_2)

        self.setting = self.get_admin_settings()

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

        self.browser.title.should.be.within([
            self.officer.display_name,
            '{first}. {last}'.format(
                last=self.officer.officer_last,
                first=self.officer.officer_first[0])
        ])

    def test_filter_by_intersected_officer(self):
        self.go_to_officer_detail_page(self.officer)

        # integrity check
        self.until(self.ajax_complete)
        self.number_of_complaints().should.equal(3)

        for officer in [self.involved_officer, self.witness_officer]:
            checkmark = "#officer_%s .checkmark" % officer.id
            self.find(checkmark).click()
            self.until(lambda: self.number_of_complaints().should.equal(1))
            self.find(checkmark).click()

        # Click two of them return all the complaints that the officer is involved or witnessed
        for officer in [self.involved_officer, self.witness_officer]:
            checkmark = "#officer_%s .checkmark" % officer.id
            self.find(checkmark).click()

        self.number_of_complaints().should.equal(2)

    def test_logo_link_back_to_current_data_tool_session(self):
        self.visit_home()
        session_url = self.browser.current_url

        self.find('#officer_%s .officer-link' % self.officer.id).click()
        logo_link = self.find('.cpdp-logo').find_element_by_xpath('..')
        logo_link.get_attribute('href').should.equal(session_url)

    def test_display_stories(self):
        story1 = StoryFactory(officer=self.officer, url=TEST_DOCUMENT_URL)
        story2 = StoryFactory(officer=self.officer, url=TEST_DOCUMENT_URL)
        story_types_order = [story2.story_type.capitalize(), story1.story_type.capitalize()]

        self.setting.story_types_order = ",".join(story_types_order)
        self.setting.save()

        self.go_to_officer_detail_page(self.officer)

        self.until_ajax_complete()

        story_types = self.find_all("#story_list h3")
        story_types = [x.text for x in story_types]
        story_types.should.equal(story_types_order)

        self.should_see_texts([
            story1.title,
            story1.short_description,
            story2.title,
            story2.short_description,
        ])
        self.find('.document-url').get_attribute('href')\
            .should.equal(TEST_DOCUMENT_URL)
        self.find('.document-thumbnail').should.be.ok

    def go_to_officer_detail_page(self, officer):
        self.visit_home()
        self.find('#officer_%s .officer-link' % officer.id).click()

    def number_of_complaints(self):
        return len(self.find_all('.complaint-row'))
