import datetime

from allegation.factories import (
    OfficerFactory, AllegationFactory, OfficerAllegationFactory)
from common.tests.core import BaseLivePhoneTestCase


class MobileOfficerPageTest(BaseLivePhoneTestCase):
    def test_all_good_data(self):
        officer_rank = 'PO'
        officer_rank_display = 'Police Officer'
        officer_star = 99

        officer_unit = '012'
        officer_unit_display = 'District 12 - Near West'

        officer_appt_date = '1992-01-02'
        officer_gender = 'M'
        officer_gender_display = 'Male'
        officer_race = 'Black'

        allegation_final_finding = 'un'
        allegation_final_finding_display = 'Unfounded'
        allegation_incident_date = datetime.date(1990, 10, 2)
        allegation_incident_date_display = 'Oct 02, 1990'

        other_officer_gender = 'F'
        other_officer_race = 'Native American'
        other_officer_description = 'Female (Native American)'
        related_display = 'Co-accused in 1 case'

        officer = OfficerFactory(
            rank=officer_rank, unit=officer_unit, race=officer_race,
            appt_date=officer_appt_date, gender=officer_gender,
            star=officer_star)

        other_officer = OfficerFactory(
            gender=other_officer_gender, race=other_officer_race)

        allegation = AllegationFactory(incident_date=allegation_incident_date)
        officer_allegation = OfficerAllegationFactory(
            allegation=allegation, officer=officer,
            final_finding=allegation_final_finding)

        OfficerAllegationFactory(
            officer=other_officer, final_finding=allegation_final_finding,
            cat=officer_allegation.cat, allegation=allegation)

        self.visit_officer_page(officer.id)

        self.until(lambda: self.find('.name').text.should.equal(officer.display_name))
        self.find('.badge-value').text.should.equal(str(officer.star))

        officer_summary = self.find('.officer-summary-section').text
        officer_summary.should.contain(officer_rank_display)
        officer_summary.should.contain(officer_unit_display)
        officer_summary.should.contain(officer_appt_date)
        officer_summary.should.contain(officer_gender_display)
        officer_summary.should.contain(officer_race)
        self.find('.tab-navs .tab-complaints').click()
        self.find('.crid-number').text.should.equal(str(allegation.crid))
        self.find('.final-finding').text.should.equal(
            allegation_final_finding_display)
        self.find('.complaint-category .category').text.should.equal(
            officer_allegation.cat.category)
        self.find('.complaint-category .sub-category').text.should.equal(
            officer_allegation.cat.allegation_name)

        self.should_see_text(allegation_incident_date_display)
        allegation_officers_display = '{display_name} and 1 other'.format(display_name=officer.display_name)

        self.should_see_text(allegation_officers_display)
        len(self.find_all('.circles .circle')).should.equal(2)

        self.find('.tab-navs .tab-co-accused').click()

        co_accused = self.find('.co-accused-list').text
        co_accused.should.contain(other_officer.display_name)
        co_accused.should.contain(related_display)
        co_accused.should.contain(other_officer_description)

    def test_bad_officer_pk(self):
        bad_officer_pk = 1234
        not_match_text = 'The id {officer_id} is not recorded in out database.'.format(officer_id=bad_officer_pk)

        self.visit_officer_page(bad_officer_pk)

        self.until(lambda: self.should_see_text(not_match_text))

    def test_no_related_officer(self):
        officer = OfficerFactory()
        OfficerAllegationFactory(officer=officer)

        self.visit_officer_page(officer.id)
        self.until(lambda: self.find_all('.tab-navs .tab-co-accused').should.have.length_of(1))
        self.find('.tab-navs .tab-co-accused').click()

        self.until(lambda: self.find('.no-related-officer'))
        no_related_officer_text = 'No any officer related to this officer.'
        self.should_see_text(no_related_officer_text)

    def test_no_summary_section(self):
        officer = OfficerFactory(gender='', rank=None, appt_date=None,
                                 unit='', race='')
        OfficerAllegationFactory(officer=officer)

        self.visit_officer_page(officer.id)
        self.find_all('.officer-summary-section').should.have.length_of(0)

    def test_less_data_information_officer(self):
        # no data, race is keep here to make summary section not to be hidden
        officer = OfficerFactory(gender='', rank=None, appt_date=None, unit='', race='Hispanic')
        OfficerAllegationFactory(officer=officer)

        self.visit_officer_page(officer.id)
        self.until(lambda: self.find('.officer-summary-section'))

        officer_summary = self.find('.officer-summary-section').text
        officer_summary.shouldnt.contain('Rank')
        officer_summary.shouldnt.contain('Unit')
        officer_summary.shouldnt.contain('Joined Date')
        officer_summary.shouldnt.contain('Sex')

        # Invalid units and no race data
        other_officer = OfficerFactory(gender='M', rank=None, appt_date=None, unit='999', race='')
        OfficerAllegationFactory(officer=other_officer)

        self.visit_officer_page(other_officer.id)
        self.until(lambda: self.find('.officer-summary-section'))

        officer_summary = self.find('.officer-summary-section').text
        officer_summary.shouldnt.contain('Unit')
        officer_summary.shouldnt.contain('Unit')
