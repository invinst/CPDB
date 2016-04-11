from allegation.factories import AllegationFactory, AllegationCategoryFactory, OfficerAllegationFactory, OfficerFactory
from common.tests.core import SimpleTestCase
from mobile.utils.mobile_url_builder import MobileUrlBuilder


class MobileUrlBuilderTest(SimpleTestCase):
    def test_complaint_page_with_category(self):
        crid = '12345'
        category_id = 123456
        category_name = 'category name'
        expected_url = '/complaint/12345/category-name/x8G40LjV'

        allegation = AllegationFactory(crid=crid)
        category = AllegationCategoryFactory(pk=category_id, category=category_name)
        officer_allegation = OfficerAllegationFactory(allegation=allegation, cat=category)

        MobileUrlBuilder().complaint_page(officer_allegation).should.be.equal(expected_url)

    def test_complaint_page_without_category(self):
        crid = '12345'
        expected_url = '/complaint/12345/no-category/r9ME4Vao'

        allegation = AllegationFactory(crid=crid)
        officer_allegation = OfficerAllegationFactory(allegation=allegation, cat=None)

        MobileUrlBuilder().complaint_page(officer_allegation).should.be.equal(expected_url)

    def test_officer_page(self):
        officer_first = 'first'
        officer_last = 'last'
        officer_id = 1
        expected_url = '/officer/first-last/1'

        officer = OfficerFactory(id=officer_id, officer_first=officer_first, officer_last=officer_last)

        MobileUrlBuilder().officer_page(officer).should.be.equal(expected_url)

    def test_complaint_page_by_crid_and_category(self):
        crid = '12345'
        cat = {'cat__id': 123456, 'cat__category': 'category name'}
        expected_url = '/complaint/12345/category-name/x8G40LjV'

        MobileUrlBuilder().complaint_page_by_crid_and_category(crid, cat).should.be.equal(expected_url)

    def test_complaint_page_by_crid_and_category_are_empty(self):
        crid = '12345'
        cat = {'cat__id': None, 'cat__category': None}
        expected_url = '/complaint/12345/no-category/r9ME4Vao'

        MobileUrlBuilder().complaint_page_by_crid_and_category(crid, cat).should.be.equal(expected_url)
