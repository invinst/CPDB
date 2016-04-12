from unittest.mock import MagicMock, patch

from allegation.factories import OfficerFactory, AllegationFactory, AllegationCategoryFactory, OfficerAllegationFactory
from common.tests.core import SimpleTestCase
from mobile.constants import DEFAULT_REDIRECTORS
from mobile.services.mobile_redirector_service import (DesktopToMobileRedirectorMixin,
                                                       OfficerSessionDesktopToMobileRedirector,
                                                       AllegationSessionDesktopToMobileRedirector, active_for,
                                                       DesktopToMobileRedirectorService)
from mobile.utils.mobile_url_builder import MobileUrlBuilder


class ActiveForDecoratorTest(SimpleTestCase):
    def test_method_is_activated_in_decorator(self):
        filter_key = 'officer'
        mock = MagicMock(filters={filter_key: [{'value': 'xyz', 'category': filter_key}]})
        method = MagicMock(return_value='return_value')
        decoratored_mock = active_for([filter_key])(method)

        decoratored_mock(mock).should.equal('return_value')

        method.assert_called_with(mock, officer=['xyz'])

    def test_method_is_not_activated_in_decorator(self):
        mock = MagicMock(filters={})
        method = MagicMock(return_value='return_value')

        decoratored_mock = active_for(['officer'])(method)

        decoratored_mock(mock).should.equal([])

    def test_method_is_not_activated_in_decorator_if_just_part_of_them_matched_active_for(self):
        filter_key = 'officer'
        mock = MagicMock(filters={filter_key: [{'value': 'xyz', 'category': filter_key}]})
        method = MagicMock(return_value='return_value')
        decoratored_mock = active_for([filter_key, 'other-extra-key'])(method)

        decoratored_mock(mock).should.equal([])


class DesktopToMobileRedirectorMixinTest(SimpleTestCase):
    @patch('inspect.getmembers')
    def test_should_call_method_start_withs_redirect(self, inspect_getmembers):
        redirector = DesktopToMobileRedirectorMixin({})
        redirector._redirect_example = MagicMock(return_value=[])
        inspect_getmembers.return_value = [('_redirect_example', redirector._redirect_example)]

        redirector.redirect_url()

        redirector._redirect_example.called.should.be.true


class OfficerSessionDesktopToMobileRedirectorTest(SimpleTestCase):
    def redirect_officer_id_only_session_with_filter(self, filters):
        redirector = OfficerSessionDesktopToMobileRedirector(filters)
        return redirector._redirect_officer_id_only_session()

    def redirect_officer_badge_only_session_with_filter(self, filters):
        redirector = OfficerSessionDesktopToMobileRedirector(filters)
        return redirector._redirect_officer_badge_only_session()

    def test_redirect_officer_id_only_session_should_return_url_if_officer_exists(self):
        officer = OfficerFactory()
        filters = {'officer': [{'value': officer.id, 'category': 'officer'}]}

        urls = self.redirect_officer_id_only_session_with_filter(filters)

        urls.should.equal([MobileUrlBuilder().officer_page(officer)])

    def test_redirect_officer_id_only_session_should_return_url_if_officer_not_exists(self):
        bad_officer_pk = -1
        filters = {'officer': [{'value': bad_officer_pk, 'category': 'officer'}]}

        urls = self.redirect_officer_id_only_session_with_filter(filters)

        len(urls).should.be.equal(0)

    def test_redirect_officer_badge_only_session_should_return_url_if_officer_exists(self):
        officer = OfficerFactory()
        filters = {'officer__star': [{'value': officer.star, 'category': 'officer__star'}]}

        urls = self.redirect_officer_badge_only_session_with_filter(filters)

        urls.should.equal([MobileUrlBuilder().officer_page(officer)])

    def test_redirect_officer_badge_only_session_should_return_url_if_officer_not_exists(self):
        bad_officer_badge = -1
        filters = {'officer__star': [{'value': bad_officer_badge, 'category': 'officer__star'}]}

        urls = self.redirect_officer_badge_only_session_with_filter(filters)

        len(urls).should.be.equal(0)


class AllegationSessionDesktopToMobileRdirectorTest(SimpleTestCase):
    def redirect_allegation_id_only_session(self, filters):
        redirector = AllegationSessionDesktopToMobileRedirector(filters)
        return redirector._redirect_allegation_crid_only_session()

    def redirect_allegation_id_and_cat_session(self, filters):
        redirector = AllegationSessionDesktopToMobileRedirector(filters)
        return redirector._redirect_allegation_crid_and_cat_session()

    def test_redirect_allegation_crid_only_session_with_invalid_allegation(self):
        bad_allegation_crid = -1
        filters = {'allegation__crid': [{'value': bad_allegation_crid, 'category': 'allegation__crid'}]}

        urls = self.redirect_allegation_id_only_session(filters)

        len(urls).should.be.equal(0)

    def test_redirect_allegation_crid_only_session(self):
        allegation = AllegationFactory()
        category1 = AllegationCategoryFactory()
        category2 = AllegationCategoryFactory()

        OfficerAllegationFactory(allegation=allegation, cat=category1)
        OfficerAllegationFactory(allegation=allegation, cat=category2)
        filters = {'allegation__crid': [{'value': allegation.crid, 'category': 'allegation__crid'}]}

        urls = self.redirect_allegation_id_only_session(filters)

        allegation_redirect_url = '/s/{crid}'.format(crid=allegation.crid)
        urls.should.be.equal([allegation_redirect_url])

    def test_redirect_allegation_crid_only_session_has_only_one_officer_allegation_with_category(self):
        crid = '12345'
        category_id = 123456
        category_name = 'category name'
        expected_url = '/complaint/12345/category-name/x8G40LjV'
        allegation = AllegationFactory(crid=crid)
        category = AllegationCategoryFactory(pk=category_id, category=category_name)
        OfficerAllegationFactory(allegation=allegation, cat=category)

        filters = {
            'allegation__crid': [{'value': allegation.crid, 'category': 'allegation__crid'}]
        }

        urls = self.redirect_allegation_id_only_session(filters)
        urls.should.be.equal([expected_url])

    def test_redirect_allegation_crid_only_session_has_only_one_officer_allegation_without_category(self):
        crid = '12345'
        expected_url = '/complaint/12345/no-category/r9ME4Vao'
        allegation = AllegationFactory(crid=crid)
        OfficerAllegationFactory(allegation=allegation, cat=None)

        filters = {
            'allegation__crid': [{'value': allegation.crid, 'category': 'allegation__crid'}]
        }

        urls = self.redirect_allegation_id_only_session(filters)
        urls.should.be.equal([expected_url])

    def test_redirect_allegation_crid_sesstion_multiple_officer_allegation_but_one_category(self):
        crid = '12345'
        expected_url = '/complaint/12345/no-category/r9ME4Vao'
        allegation = AllegationFactory(crid=crid)
        OfficerAllegationFactory.create_batch(2, allegation=allegation, cat=None)

        filters = {
            'allegation__crid': [{'value': allegation.crid, 'category': 'allegation__crid'}]
        }

        urls = self.redirect_allegation_id_only_session(filters)
        urls.should.be.equal([expected_url])

    def test_redirect_allegation_crid_and_cat_session(self):
        crid = '12345'
        category_id = 123456
        category_name = 'category name'
        expected_url = '/complaint/12345/category-name/x8G40LjV'
        allegation = AllegationFactory(crid=crid)
        category = AllegationCategoryFactory(pk=category_id, category=category_name)
        OfficerAllegationFactory(allegation=allegation, cat=category)

        filters = {
            'allegation__crid': [{'value': allegation.crid, 'category': 'allegation__crid'}],
            'cat': [{'value': category.pk, 'category': 'cat'}]
        }

        urls = self.redirect_allegation_id_and_cat_session(filters)
        urls.should.be.equal([expected_url])


class DesktopToMobileRedirectorServiceTest(SimpleTestCase):
    def test_register_and_unregister(self):
        redirect_service = DesktopToMobileRedirectorService(redirectors=[])
        len(redirect_service.redirectors).should.be.equal(0)

        redirect_service.register(OfficerSessionDesktopToMobileRedirector)
        len(redirect_service.redirectors).should.be.equal(1)

        redirect_service.unregister(OfficerSessionDesktopToMobileRedirector)
        len(redirect_service.redirectors).should.be.equal(0)

    def test_perform(self):
        allegation = AllegationFactory()

        filters = {
            'allegation__crid': [{'value': allegation.crid, 'category': 'allegation__crid'}],
        }

        redirect_service = DesktopToMobileRedirectorService(DEFAULT_REDIRECTORS)
        urls = redirect_service.perform(filters)

        allegation_redirect_url = '/s/{crid}'.format(crid=allegation.crid)
        urls.should.be.equal([allegation_redirect_url])
