from allegation.tests.views.ui.test_home_page import IntegrationTestHelperMixin
from allegation.factories import AllegationFactory, OfficerFactory, ComplainingWitnessFactory, AllegationCategoryFactory
from common.tests.core import BaseLiveTestCase
from common.models import Allegation, ComplainingWitness, Officer


class RaceGenderTabTest(BaseLiveTestCase, IntegrationTestHelperMixin):
    RACES = ['White', 'Black', 'Hispanic', 'White/Hispanic', 'Black/Hispanic',
             'Indigenous', 'Asian', 'Unknown']
    DISPLAY_RACES = ['White officers', 'Black officers', 'Hispanic officers', 'Others']
    NON_DISPLAY_RACES = ['Indigenous', 'Asian', 'Unknown', 'White/Hispanic',
                         'Black/Hispanic']
    GENDERS = ['M', 'F', 'X']
    DISPLAY_GENDERS = ['Male', 'Female', 'Trans']

    def setUp(self):
        Allegation.objects.all().delete()
        Officer.objects.all().delete()
        ComplainingWitness.objects.all().delete()

    def go_to_race_gender_tab(self):
        self.visit_home()
        self.link('Race & Gender').click()
        self.element_by_tagname_and_text('li', 'Race & Gender').has_class('active')

    def create_allegation_with_races(self, category=None):
        category = category or AllegationCategoryFactory()

        for race in self.RACES:
            allegation = AllegationFactory(officer=OfficerFactory(race=race), cat=category)
            ComplainingWitnessFactory(crid=allegation.crid, race=race)

    def create_allegation_with_genders(self, category=None):
        category = category or AllegationCategoryFactory()

        for gender in self.GENDERS:
            allegation = AllegationFactory(officer=OfficerFactory(gender=gender), cat=category)
            ComplainingWitnessFactory(crid=allegation.crid, gender=gender)

    def test_race_chart(self):
        # See RACES and how we create allegation for more information why
        analysis = {
            'White officers': 1,
            'Black officers': 1,
            'Hispanic officers': 3,
            'Others': 3
        }
        total = 8

        self.create_allegation_with_races()
        self.go_to_race_gender_tab()
        self.until(self.ajax_complete)

        self.ensure_the_correct_race_data_is_shown(analysis, total)

    def test_gender_chart(self):
        self.create_allegation_with_genders()

        self.go_to_race_gender_tab()
        self.until(self.ajax_complete)

        ratio = 1 / len(self.GENDERS)
        self.ensure_the_correct_gender_data_is_shown(ratio)

    def test_gender_chart_by_filter(self):
        category = AllegationCategoryFactory(category='Category')
        other_category = AllegationCategoryFactory(category='Other Category')

        self.create_allegation_with_genders(category=category)
        AllegationFactory(officer=OfficerFactory(gender='F'), cat=other_category)

        self.visit_home()
        self.link('Categories').click()
        self.link(category.category).click()
        self.link('Race & Gender').click()
        self.until(self.ajax_complete)
        ratio = 1 / len(self.GENDERS)

        self.ensure_the_correct_gender_data_is_shown(ratio)

    def test_trigger_4_different_filters_when_click_on_other_block(self):
        self.create_allegation_with_races()
        self.go_to_race_gender_tab()

        self.find('.officer-race-chart .others text').click()
        self.until_ajax_complete()

        len(self.find_all('.filter-name')).should.equal(4)

    def test_race_chart_by_filter(self):
        analysis = {
            'White officers': 1,
            'Black officers': 1,
            'Hispanic officers': 3,
            'Others': 3
        }
        total = 8
        category = AllegationCategoryFactory(category='Category')
        other_category = AllegationCategoryFactory(category='Other Category')

        self.create_allegation_with_races(category=category)
        allegation = AllegationFactory(officer=OfficerFactory(race='White'), cat=other_category)
        ComplainingWitnessFactory(crid=allegation.crid, race='White')

        self.visit_home()
        self.link('Categories').click()
        self.link(category.category).click()
        self.link('Race & Gender').click()
        self.until(self.ajax_complete)

        self.ensure_the_correct_race_data_is_shown(analysis, total)

    def test_toggle_filter_tags(self):
        self.create_allegation_with_genders()

        self.go_to_race_gender_tab()
        self.until(self.ajax_complete)

        self.officer_gender_chart_block('.female').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female').should.be.ok

        self.officer_gender_chart_block('.female').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female').shouldnt.be.ok

        self.officer_gender_chart_block('.female').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female').should.be.ok

        self.officer_gender_chart_block('.male').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female').shouldnt.be.ok
        self.element_by_classname_and_text('filter-name', 'Male').should.be.ok

        self.find('.officer-count').text.should.contain('1')
        self.find('.complaint-count').text.should.contain('1')

    def officer_gender_chart_block(self, block_class):
        block_css_path = ".officer-gender-chart {block_class} text".format(block_class=block_class)
        return self.find(block_css_path)

    def ensure_the_correct_gender_data_is_shown(self, ratio):
        complaint_gender_chart = self.find('.complaint-gender-chart').text
        officer_gender_chart = self.find('.officer-gender-chart').text

        for gender in self.DISPLAY_GENDERS:
            complaint_gender_chart.should.contain(self.percent_text(gender, ratio))
            officer_gender_chart.should.contain(self.percent_text(gender, ratio))

    def ensure_the_correct_race_data_is_shown(self, analysis, total):
        complaint_race_chart = self.find('.complaint-race-chart').text
        officer_race_chart = self.find('.officer-race-chart').text

        for race in self.DISPLAY_RACES:
            ratio = analysis[race] / total
            complaint_race_chart.should.contain(self.percent_text(race, ratio))
            officer_race_chart.should.contain(self.percent_text(race, ratio))

    def percent_text(self, label, ratio):
        percent = int(ratio *  100)
        text = "%d" % percent
        return "{label} {percent}".format(label=label, percent=text)
