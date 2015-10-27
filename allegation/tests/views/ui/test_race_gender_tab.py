from allegation.tests.views.ui.test_home_page import IntegrationTestHelperMixin
from allegation.factories import AllegationFactory, OfficerFactory, ComplainingWitnessFactory
from common.tests.core import BaseLiveTestCase
from common.models import Allegation


class RaceGenderTabTest(BaseLiveTestCase, IntegrationTestHelperMixin):
    RACES = ['White', 'Black', 'Hispanic', 'White/Hispanic', 'Black/Hispanic',
             'Indigenous', 'Asian', 'Unknown']
    DISPLAY_RACES = ['White', 'Black', 'Hispanic', 'Others']
    NON_DISPLAY_RACES = ['Indigenous', 'Asian', 'Unknown', 'White/Hispanic',
                         'Black/Hispanic']
    GENDERS = ['M', 'F', 'X']
    DISPLAY_GENDERS = ['Male', 'Female', 'Trans']

    def tearDown(self):
        Allegation.objects.all().delete()

    def go_to_race_gender_tab(self):
        self.visit_home()
        self.link('Race & Gender').click()
        self.element_by_tagname_and_text('li', 'Race & Gender').has_class('active')

    def create_allegation_with_races(self):
        for race in self.RACES:
            allegation = AllegationFactory(officer=OfficerFactory(race=race))
            ComplainingWitnessFactory(crid=allegation.crid, race=race)

    def create_allegation_with_genders(self):
        for gender in self.GENDERS:
            allegation = AllegationFactory(officer=OfficerFactory(gender=gender))
            ComplainingWitnessFactory(crid=allegation.crid, gender=gender)

    def test_race_chart(self):
        self.create_allegation_with_races()
        self.go_to_race_gender_tab()

        graph = self.find('#gender-race-tab').text

        for race in self.DISPLAY_RACES:
            graph.should.contain(race)

        for race in self.NON_DISPLAY_RACES:
            graph.shouldnt.contain(race)

    def test_gender_chart(self):
        self.create_allegation_with_genders()
        self.go_to_race_gender_tab()
        percent_of_each = "{0:.2f}%".format(100 / len(self.GENDERS))

        self.until(self.ajax_complete)
        complaint_gender_chart = self.find('.complaint-gender-chart').text
        officer_gender_chart = self.find('.officer-gender-chart').text

        for gender in self.DISPLAY_GENDERS:
            complaint_gender_chart.should.contain(self.percent_text(gender,
                                                               percent_of_each))
            officer_gender_chart.should.contain(self.percent_text(gender,
                                                            percent_of_each))

    def percent_text(self, label, percent):
        return "{label} {percent}".format(race=race, percent=percent)
