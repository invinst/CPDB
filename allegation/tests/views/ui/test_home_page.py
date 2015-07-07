from common.tests.core import *
from allegation.factories import AllegationFactory, AllegationCategoryFactory


class HomePageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        self.allegation = AllegationFactory(cat=self.allegation_category)

    def test_click_on_category_only_show_allegation_belong_to_it(self):
        other_category = AllegationCategoryFactory()
        AllegationFactory(cat=other_category)

        self.visit('/')
        len(self.find_all('.officer')).should.equal(2)
        self.link(self.allegation_category.category).click()
        len(self.find_all('.officer')).should.equal(1)

    def test_click_on_officer_will_show_compliant(self):
        self.visit('/')
        len(self.find_all('.officer')).should.equal(1)

        self.find('.checkmark').click()
        self.until(lambda: self.element_exist('.complaint_list'))
        self.find('.complaint-row > .row').click()
        self.element_exist('.complaint_detail').should.equal(True)
