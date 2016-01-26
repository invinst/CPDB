from allegation.factories import (
    OfficerAllegationFactory, OfficerFactory, ComplainingWitnessFactory,
    AllegationCategoryFactory)
from common.tests.core import BaseLiveTestCase
from common.models import Allegation, ComplainingWitness, Officer


class RaceGenderTabTest(BaseLiveTestCase):
    RACES = ['White', 'Black', 'Hispanic', 'White/Hispanic', 'Black/Hispanic',
             'Indigenous', 'Asian', 'Unknown']
    DISPLAY_RACES_FOR_COMPLAINANTS = ['White', 'Black', 'Hispanic', 'Others']
    DISPLAY_RACES_FOR_OFFICERS = [
        'White officers', 'Black officers', 'Hispanic officers', 'Others']
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
        self.element_by_tagname_and_text('li', 'Race & Gender')\
            .has_class('active')

    def create_allegation_with_races(self, category=None):
        category = category or AllegationCategoryFactory()

        for race in self.RACES:
            officer_allegation = OfficerAllegationFactory(
                officer=OfficerFactory(race=race), cat=category)
            ComplainingWitnessFactory(
                crid=officer_allegation.allegation.crid, race=race,
                allegation=officer_allegation.allegation)

    def create_allegation_with_genders(self, category=None):
        category = category or AllegationCategoryFactory()

        for gender in self.GENDERS:
            officer_allegation = OfficerAllegationFactory(
                officer=OfficerFactory(gender=gender), cat=category)
            ComplainingWitnessFactory(
                crid=officer_allegation.allegation.crid, gender=gender,
                allegation=officer_allegation.allegation)

    def test_race_chart(self):
        # See RACES and how we create allegation for more information why
        analysis_for_complainants = {
            'White': 1,
            'Black': 1,
            'Hispanic': 3,
            'Others': 3
        }
        analysis_for_officer = {
            'White officers': 1,
            'Black officers': 1,
            'Hispanic officers': 3,
            'Others': 3
        }
        total = 8

        self.create_allegation_with_races()
        self.go_to_race_gender_tab()
        self.until(self.ajax_complete)

        self.ensure_the_correct_race_data_is_shown(
            analysis_for_complainants, analysis_for_officer, total)

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
        OfficerAllegationFactory(
            officer=OfficerFactory(gender='F'), cat=other_category)

        self.visit_home()
        self.link('Categories').click()
        self.link(category.category).click()
        self.link('Race & Gender').click()
        self.until(self.ajax_complete)
        ratio = 1 / len(self.GENDERS)

        self.ensure_the_correct_gender_data_is_shown(ratio)

    def test_trigger_different_filters_when_click_on_other_block(self):
        self.create_allegation_with_races()
        self.go_to_race_gender_tab()

        self.find('.officer-race-chart .others text').click()
        self.until_ajax_complete()

        len(self.find_all('.filter-name')).should.equal(3)

    def test_race_chart_by_filter(self):
        analysis_for_complainants = {
            'White': 1,
            'Black': 1,
            'Hispanic': 3,
            'Others': 3
        }
        analysis_for_officer = {
            'White officers': 1,
            'Black officers': 1,
            'Hispanic officers': 3,
            'Others': 3
        }
        total = 8
        category = AllegationCategoryFactory(category='Category')
        other_category = AllegationCategoryFactory(category='Other Category')

        self.create_allegation_with_races(category=category)
        officer_allegation = OfficerAllegationFactory(
            officer=OfficerFactory(race='White'), cat=other_category)
        ComplainingWitnessFactory(
            crid=officer_allegation.allegation.crid, race='White',
            allegation=officer_allegation.allegation)

        self.visit_home()
        self.link('Categories').click()
        self.link(category.category).click()
        self.link('Race & Gender').click()
        self.until(self.ajax_complete)

        self.ensure_the_correct_race_data_is_shown(
            analysis_for_complainants, analysis_for_officer, total)

    def test_race_chart_allegation_count(self):
        complaints_by_class = [
            ('.white', 1),
            ('.black', 1),
            ('.hispanic', 3),
            ('.others', 3)
        ]

        self.create_allegation_with_races()
        self.go_to_race_gender_tab()
        self.until(self.ajax_complete)

        for class_name, complaints_count in complaints_by_class:
            self.complainant_race_chart_block(class_name).click()
            self.until_ajax_complete()
            self.find('.complaint-count h3 span:nth-child(2)').text.should.equal(str(complaints_count))

    def test_toggle_filter_tags(self):
        self.create_allegation_with_genders()

        self.go_to_race_gender_tab()
        self.until(self.ajax_complete)

        self.officer_gender_chart_block('.female').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female')\
            .should.be.ok

        self.officer_gender_chart_block('.female').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female')\
            .shouldnt.be.ok

        self.officer_gender_chart_block('.female').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female')\
            .should.be.ok

        self.officer_gender_chart_block('.male').click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', 'Female')\
            .shouldnt.be.ok
        self.element_by_classname_and_text('filter-name', 'Male').should.be.ok

        self.find('.officer-count').text.should.contain('1')
        self.find('.complaint-count').text.should.contain('1')

    def test_dim_out_inactive_sections(self):
        self.create_allegation_with_races()
        self.create_allegation_with_genders()

        self.go_to_race_gender_tab()
        self.until_ajax_complete()
        self.officer_gender_chart_block('.female').click()
        self.until_ajax_complete()

        other_sections = ['male', 'trans']
        [self.assert_active(section) for section in other_sections]

        other_charts = ['complaint-gender-chart', 'complaint-race-chart', 'officer-race-chart']
        [self.assert_inactive(chart) for chart in other_charts]

    def complainant_gender_chart_block(self, block_class):
        block_css_class = '.complaint-gender-chart {block_class}'\
            .format(block_class=block_class)
        return self.find(block_css_class)

    def officer_gender_chart_block(self, block_class):
        block_css_path = ".officer-gender-chart {block_class} text"\
            .format(block_class=block_class)
        return self.find(block_css_path)

    def complainant_race_chart_block(self, block_class):
        block_css_path = ".complaint-race-chart {block_class} text"\
            .format(block_class=block_class)
        return self.find(block_css_path)

    def ensure_the_correct_gender_data_is_shown(self, ratio):
        complaint_gender_chart = self.find('.complaint-gender-chart').text
        officer_gender_chart = self.find('.officer-gender-chart').text

        for gender in self.DISPLAY_GENDERS:
            complaint_gender_chart.should.contain(
                self.percent_text(gender, ratio))
            officer_gender_chart.should.contain(
                self.percent_text(gender, ratio))

    def ensure_the_correct_race_data_is_shown(
            self, analysis_for_complainants, analysis_for_officer, total):
        complaint_race_chart = self.find('.complaint-race-chart').text
        officer_race_chart = self.find('.officer-race-chart').text

        for race in self.DISPLAY_RACES_FOR_COMPLAINANTS:
            ratio = analysis_for_complainants[race] / total
            complaint_race_chart.should.contain(self.percent_text(race, ratio))

        for race in self.DISPLAY_RACES_FOR_OFFICERS:
            ratio = analysis_for_officer[race] / total
            officer_race_chart.should.contain(self.percent_text(race, ratio))

    def percent_text(self, label, ratio):
        percent = int(ratio * 100)
        text = "%d" % percent
        return "{label} {percent}".format(label=label, percent=text)

    def assert_active(self, section):
        return self.find('.officer-gender-chart .{section}'.format(section=section)).\
            has_class('inactive').should.be.true

    def assert_inactive(self, chart):
        len(self.find_all('.{chart} .inactive'.format(chart=chart))).should.equal(0)
