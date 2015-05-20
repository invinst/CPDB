from allegation.factories import OfficerFactory, AllegationCategoryFactory, AllegationFactory
from common.models import Officer, AllegationCategory
from common.tests.core import BaseLiveTestCase


class FilterOnSearchChangeTestCase(BaseLiveTestCase):
    def setUp(self):
        officer1 = OfficerFactory(officer_first='A')
        officer2 = OfficerFactory(officer_first='B')
        cat1 = AllegationCategoryFactory(category='A')
        cat2 = AllegationCategoryFactory(category='B')
        self.allegation = AllegationFactory(officer=officer1, cat=cat1)
        self.other = AllegationFactory(officer=officer2, cat=cat2)

        self.visit('/')

    def tearDown(self):
        Officer.objects.all().delete()
        AllegationCategory.objects.all().delete()

    def test_no_search_term(self):
        self.should_see_text(self.allegation.crid)
        self.should_see_text(self.other.crid)

    def test_filter_by_crid(self):
        self.find('.ui-autocomplete-input').send_keys(self.allegation.crid)
        elem = lambda: self.element_by_classname_and_text('autocomplete-crid', self.allegation.crid)
        self.until(elem)
        elem().click()

        self.check_remaining_allegations()

    def test_filter_by_officer_name(self):
        self.find('.ui-autocomplete-input').send_keys(self.allegation.officer.officer_first)
        elem = lambda: self.element_by_classname_and_text('autocomplete-officer_name',
                                                          '%s %s' % (self.allegation.officer.officer_first,
                                                                     self.allegation.officer.officer_last))
        self.until(elem)
        elem().click()

        self.check_remaining_allegations()

    def test_filter_by_category(self):
        self.find('.ui-autocomplete-input').send_keys(self.allegation.cat.category)
        elem = lambda: self.element_by_classname_and_text('autocomplete-category', self.allegation.cat.category)
        self.until(elem)
        elem().click()
        self.check_remaining_allegations()

    def check_remaining_allegations(self):
        self.until(lambda: self.should_not_see_text(str(self.other.crid)))
        self.until(lambda: self.should_see_text(str(self.allegation.crid)))
