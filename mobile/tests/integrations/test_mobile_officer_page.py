import datetime

from allegation.factories import (
    OfficerFactory, AllegationFactory, OfficerAllegationFactory)
from common.tests.core import BaseLivePhoneTestCase


class MobileOfficerPageTest(BaseLivePhoneTestCase):
    def go_to_officer_page(self, slug='', pk=''):
        self.visit('/mobile/officer/{slug}/{pk}'.format(slug=slug, pk=pk))

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

        self.go_to_officer_page(slug=officer.officer_first, pk=officer.pk)

        self.find('.name').text.should.equal(officer.display_name)
        self.find('.badge-value').text.should.equal(str(officer.star))

        self.should_see_text(officer_rank_display)
        self.should_see_text(officer_unit_display)
        self.should_see_text(officer_appt_date)
        self.should_see_text(officer_gender_display)
        self.should_see_text(officer_race)

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
        self.should_see_text(other_officer.display_name)
        self.should_see_text(related_display)
        self.should_see_text(other_officer_description)

    def test_bad_officer_pk(self):
        bad_officer_pk = 1234
        officer_slug = 'xxxx'
        not_match_text = 'The id {officer_id} is not recorded in out database.'.format(officer_id=bad_officer_pk)
        self.go_to_officer_page(slug=officer_slug, pk=bad_officer_pk)

        self.until(lambda: self.should_see_text(not_match_text))

    def test_no_related_officer(self):
        officer = OfficerFactory()
        OfficerAllegationFactory(officer=officer)

        self.go_to_officer_page(slug=officer.officer_first, pk=officer.pk)
        self.find('.tab-navs .tab-co-accused').click()

        self.until(lambda: self.find('.no-related-officer'))
        no_related_officer_text = 'No any officer related to this officer.'
        self.should_see_text(no_related_officer_text)

    def test_less_officer_information(self):
        officer = OfficerFactory(gender='', rank=None, appt_date=None,
                                 unit='', race=None, star=None)
        OfficerAllegationFactory(officer=officer)
        officer_gender_display = 'Gender unknown'
        officer_star_display = 'Badge  Unknown'
        officer_rank_display = 'Rank N/A'
        officer_join_date_display = 'Joined Unknown'
        officer_unit_display = 'Unit Unknown'
        officer_race_display = 'Race unknown'

        self.go_to_officer_page(slug=officer.officer_first, pk=officer.pk)
        self.find('.tab-navs .tab-summary').click()
        self.until(lambda: self.find('.officer-summary-section'))

        self.should_see_text(officer_rank_display)
        self.should_see_text(officer_unit_display)
        self.should_see_text(officer_join_date_display)
        self.should_see_text(officer_gender_display)
        self.should_see_text(officer_race_display)
        self.should_see_text(officer_star_display)