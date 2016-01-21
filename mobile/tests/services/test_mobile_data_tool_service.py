from unittest.mock import MagicMock, patch

from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import SimpleTestCase
from mobile.services.mobile_data_tool_service import DesktopToMobileRedirectorMixin, \
    OfficerSessionDesktopToMobileRedirector, AllegationSessionDesktopToMobileRedirector, active_for




# class ActiveWhenTest(SimpleTestCase):
#     def setUp(self):
#         self.filters = {
#             'officer': {
#                 'value': 123
#             }
#         }
#
#     @active_when('officer')
#     def will_be_called_method(self):
#         pass
#
#     @active_when('not_exist')
#     def will_not_be_called_method(self):
#         pass
#
#     def test_method_will_be_called(self):
#         self.will_be_called_method()
#         self.will_not_be_called_method()
#


class DesktopToMobileRedirectorMixinTest(SimpleTestCase):
    @patch('inspect.getmembers')
    def test_should_call_method_start_withs_redirect(self, mock):
        redirector = DesktopToMobileRedirectorMixin({})
        redirector._redirect_example = MagicMock(return_value=[])
        mock.return_value = [('_redirect_example', redirector._redirect_example)]
        redirector.redirect_url()
        redirector._redirect_example.called.should.be.true

    def test_abcxyz(self):
        mock = MagicMock(filters={'officer': {'value': 'something'}})
        method = MagicMock(return_value='return_value')
        decoratored_mock = active_for('officer')(method)
        decoratored_mock(mock).should.equal('return_value')

    def test_abcxyzdef(self):
        mock = MagicMock(filters={})
        method = MagicMock(return_value='return_value')
        decoratored_mock = active_for('officer')(method)
        decoratored_mock(mock).should.equal([])

class OfficerSessionDesktopToMobileRedirectorTest(SimpleTestCase):

    def call_officer_session_desktop_to_mobile(self, filters):
        return OfficerSessionDesktopToMobileRedirector(filters=filters).redirect_url()

    def test_redirect_officer_id_only_session_success(self):
        officer = OfficerFactory()
        filters = {
            'officer': {
                'value': [officer.id]
            }
        }
        self.call_officer_session_desktop_to_mobile(filters=filters).should.equal([officer.get_mobile_url()])

    def test_redirect_officer_id_only_session_with_invalid_officer(self):
        fake_officer_id = 123
        filters = {
            'officer': {
                'value': [fake_officer_id]
            }
        }
        self.call_officer_session_desktop_to_mobile(filters=filters).should.equal([])

    def test_redirect_officer_star_only_session_success(self):
        officer = OfficerFactory()
        filters = {
            'officer__star': {
                'value': [officer.star]
            }
        }
        self.call_officer_session_desktop_to_mobile(filters=filters).should.equal([officer.get_mobile_url()])

    def test_redirect_officer_id_only_session_with_invalid_officer(self):
        fake_officer_star = 123
        filters = {
            'officer__star': {
                'value': [fake_officer_star]
            }
        }
        self.call_officer_session_desktop_to_mobile(filters=filters).should.equal([])


class AllegationSessionDesktopToMobileRedirectorTest(SimpleTestCase):
    def call_allegation_session_desktop_to_mobile(self, filters):
        return AllegationSessionDesktopToMobileRedirector(filters=filters).redirect_url()

    def test_redirect_allegation_crid_only_session_success(self):
        allegation = AllegationFactory()
        filters = {
            'allegation__crid': {
                'value': [allegation.crid]
            }
        }
        self.call_allegation_session_desktop_to_mobile(filters=filters).should.equal([allegation.get_mobile_url()])

    def test_redirect_allegation_crid_only_session_with_invalid_allegation(self):
        fake_crid = '123'
        filters = {
            'allegation__crid': {
                'value': [fake_crid]
            }
        }
        self.call_allegation_session_desktop_to_mobile(filters=filters).should.equal([])
#
#
# class MobileDataToolServiceTest(SimpleTestCase):
#     def call_mobile_data_tool_service_with_hash_id(self, filters):
#         return DesktopToMobileRedirectorService().perform(filters=filters)
#
#     def test_redirect_to_officer_page(self):
#         officer = OfficerFactory()
#         expected_url_part = '/mobile/officer/{officer_name}/{officer_id}'.format(
#                 officer_name=slugify(officer.display_name),
#                 officer_id=officer.id
#         )
#
#         filters = {
#             'officer': {
#                 'value': [officer.id]
#             }
#         }
#
#         direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
#         direct_url.should.contain(expected_url_part)
#
#     def test_redirect_to_complaint_page(self):
#         allegation = AllegationFactory()
#         expected_url_part = '/mobile/complaint/{crid}'.format(crid=allegation.crid)
#
#         filters = {
#             'allegation__crid': {
#                 'value': [allegation.crid]
#             }
#         }
#
#         direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
#         direct_url.should.contain(expected_url_part)
#
#     def test_redirect_to_not_exist_officer_page(self):
#         fake_officer_id = 123
#         filters = {
#             'officer': {
#                 'value': [fake_officer_id]
#             }
#         }
#         direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
#         direct_url.should.equal([])
#
#     def test_redirect_officer_page_by_officer_badge(self):
#         officer = OfficerFactory(star=123)
#         expected_url_part = '/mobile/officer/{officer_name}/{officer_id}'.format(
#                 officer_name=slugify(officer.display_name),
#                 officer_id=officer.id
#         )
#
#         filters = {
#             'officer__star': {
#                 'value': [officer.star]
#             }
#         }
#         direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
#         direct_url.should.equal([expected_url_part])
