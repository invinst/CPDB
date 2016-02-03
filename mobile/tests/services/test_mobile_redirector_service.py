from unittest.mock import MagicMock, patch

from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import SimpleTestCase
from mobile.constants import DEFAULT_REDIRECTORS
from mobile.services.mobile_redirector_service import (DesktopToMobileRedirectorMixin,
                                                       OfficerSessionDesktopToMobileRedirector,
                                                       AllegationSessionDesktopToMobileRedirector, active_for,
                                                       DesktopToMobileRedirectorService, get_filter_value)


def test_get_filter_value():
    filter = 'allegation__crid=1000004'
    get_filter_value(filter).should.equal('1000004')


class ActiveForDecoratorTest(SimpleTestCase):
    def test_method_is_activated_in_decorator(self):
        filter_key = 'officer'
        mock = MagicMock(filters={filter_key: [{'filter': 'abc=xyz'}]})
        method = MagicMock(return_value='return_value')
        decoratored_mock = active_for(filter_key)(method)

        decoratored_mock(mock).should.equal('return_value')

        method.assert_called_with(mock, ['xyz'])

    def test_method_is_not_activated_in_decorator(self):
        mock = MagicMock(filters={})
        method = MagicMock(return_value='return_value')

        decoratored_mock = active_for('officer')(method)

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
        filters = {'Officer': [{'filter': 'officer={officer_id}'.format(officer_id=officer.id)}]}

        urls = self.redirect_officer_id_only_session_with_filter(filters)

        urls.should.equal([officer.get_mobile_url()])

    def test_redirect_officer_id_only_session_should_return_url_if_officer_not_exists(self):
        bad_officer_pk = -1
        filters = {'Officer': [{'filter': 'officer={officer_id}'.format(officer_id=bad_officer_pk)}]}

        urls = self.redirect_officer_id_only_session_with_filter(filters)

        len(urls).should.be.equal(0)

    def test_redirect_officer_badge_only_session_should_return_url_if_officer_exists(self):
        officer = OfficerFactory()
        filters = {'Badge number': [{'filter': 'officer__star={badge}'.format(badge=officer.star)}]}

        urls = self.redirect_officer_badge_only_session_with_filter(filters)

        urls.should.equal([officer.get_mobile_url()])

    def test_redirect_officer_badge_only_session_should_return_url_if_officer_not_exists(self):
        bad_officer_badge = -1
        filters = {'Badge number': [{'filter': 'officer__star={badge}'.format(badge=bad_officer_badge)}]}

        urls = self.redirect_officer_badge_only_session_with_filter(filters)

        len(urls).should.be.equal(0)


class AllegationSessionDesktopToMobileRdirectorTest(SimpleTestCase):
    def redirect_allegation_id_only_session(self, filters):
        redirector = AllegationSessionDesktopToMobileRedirector(filters)
        return redirector._redirect_allegation_crid_only_session()

    def test_redirect_allegation_crid_only_session_with_invalid_allegation(self):
        bad_allegation_crid = -1
        filters = {'Allegation ID': [{'filter': 'allegation__crid={crid}'.format(crid=bad_allegation_crid)}]}

        urls = self.redirect_allegation_id_only_session(filters)

        len(urls).should.be.equal(0)

    def test_redirect_allegation_crid_only_session(self):
        allegation = AllegationFactory()
        filters = {'Allegation ID': [{'filter': 'allegation__crid={crid}'.format(crid=allegation.crid)}]}

        urls = self.redirect_allegation_id_only_session(filters)

        urls.should.be.equal([allegation.get_mobile_url()])


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
        officer = OfficerFactory()

        filters = {
            'Allegation ID': [{'filter': 'allegation__crid={crid}'.format(crid=allegation.crid)}],
            'Officer': [{'filter': 'officer={officer_id}'.format(officer_id=officer.id)}]
        }

        redirect_service = DesktopToMobileRedirectorService(DEFAULT_REDIRECTORS)
        urls = redirect_service.perform(filters)

        urls.should.be.equal([officer.get_mobile_url(), allegation.get_mobile_url()])
