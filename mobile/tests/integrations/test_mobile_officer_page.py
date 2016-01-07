import datetime

from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileOfficerPageTest(BaseLivePhoneTestCase):
    def go_to_officer_page(self, slug='', pk=''):
        self.visit('/mobile/officer/{slug}/{pk}'.format(slug=slug, pk=pk))

    def show_officer_tab(self, tab_name):
        self.browser.find_elements_by_xpath("//*[contains(text(), '%s')]" % tab_name)[0].click()

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

        officer = OfficerFactory(rank=officer_rank, unit=officer_unit, race=officer_race,
                                 appt_date=officer_appt_date, gender=officer_gender, star=officer_star)

        other_officer = OfficerFactory(gender=other_officer_gender, race=other_officer_race)

        allegation = AllegationFactory(officer=officer, final_finding=allegation_final_finding,
                                       incident_date=allegation_incident_date)

        AllegationFactory(officer=other_officer, final_finding=allegation_final_finding,
                          incident_date=allegation_incident_date, crid=allegation.crid, cat=allegation.cat)

        self.go_to_officer_page(slug=officer.officer_first, pk=officer.pk)

        self.find('.name').text.should.equal(officer.display_name)
        self.find('.badge-value').text.should.equal(str(officer.star))

        self.should_see_text(officer_rank_display)
        self.should_see_text(officer_unit_display)
        self.should_see_text(officer_appt_date)
        self.should_see_text(officer_gender_display)
        self.should_see_text(officer_race)

        self.show_officer_tab('Complaints')
        self.find('.crid-number').text.should.equal(str(allegation.crid))
        self.find('.final-finding').text.should.equal(allegation_final_finding_display)
        self.find('.complaint-category .category').text.should.equal(allegation.cat.category)
        self.find('.complaint-category .sub-category').text.should.equal(allegation.cat.allegation_name)

        self.should_see_text(allegation_incident_date_display)
        allegation_officers_display = officer.display_name + ' and 1 other'

        self.should_see_text(allegation_officers_display)

        len(self.find_all('.circles .circle')).should.equal(2)

        self.show_officer_tab('Co-accused')

        self.should_see_text(other_officer.display_name)
        self.should_see_text(related_display)
        self.should_see_text(other_officer_description)

    def test_bad_officer_pk(self):
        bad_officer_pk = 1234
        officer_slug = 'xxxx'
        not_match_text = 'The id %s is not recorded in out database.' % bad_officer_pk
        self.go_to_officer_page(slug=officer_slug, pk=bad_officer_pk)
        self.should_see_text(not_match_text)

    def test_no_related_officer(self):
        officer = OfficerFactory()
        AllegationFactory(officer=officer)
        self.go_to_officer_page(slug=officer.officer_first, pk=officer.pk)
        self.show_officer_tab('Co-accused')
        self.until(lambda: self.find('.no-related-officer'))
        no_related_officer_text = 'No any officer related to this officer.'
        self.should_see_text(no_related_officer_text)

    def test_less_officer_information(self):
        officer = OfficerFactory(gender='', rank=None, appt_date=None,
                                 unit='', race=None, star=None)
        AllegationFactory(officer=officer)
        officer_gender_display = 'Gender unknown'
        officer_star_display = 'Badge  Unknown'
        officer_rank_display = 'Rank N/A'
        officer_join_date_display = 'Joined Unknown'
        officer_unit_display = 'Unit Unknown'
        officer_race_display = 'Race unknown'

        self.go_to_officer_page(slug=officer.officer_first, pk=officer.pk)
        self.show_officer_tab('Summary')
        self.until(lambda: self.find('.officer-summary-section'))

        self.should_see_text(officer_rank_display)
        self.should_see_text(officer_unit_display)
        self.should_see_text(officer_join_date_display)
        self.should_see_text(officer_gender_display)
        self.should_see_text(officer_race_display)
        self.should_see_text(officer_star_display)
