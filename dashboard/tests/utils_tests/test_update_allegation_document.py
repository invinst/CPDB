from mock import patch, Mock

from rest_framework import status
from requests.exceptions import RequestException

from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase
from dashboard.exceptions import InvalidDocumentError
from dashboard.utils import update_allegation_document


class ResponseMock:
    def __init__(self, status_code, content):
        self.status_code = status_code
        self.content = content


class UpdateAllegationDocumentTestCase(SimpleTestCase):
    def test_extract_stuffs_from_link(self):
        crid = 1059593
        document_id = 2705002
        AllegationFactory(crid=crid)
        link = 'https://abc.xyz/documents/{document_id}-CR-{crid}.html'.format(crid=crid, document_id=document_id)

        actual_crid = update_allegation_document(crid=None, link=link, title='def', test_link=False)
        actual_crid.should.equal(str(crid))

        allegation = Allegation.objects.get(crid=actual_crid)
        allegation.document_id.should.equal(document_id)
        allegation.document_normalized_title.should.equal('CR-1059593')
        allegation.document_title.should.equal('def')

    def test_bad_link_raise_error(self):
        update_allegation_document.when.called_with(crid=None, link='badlink').should.throw(InvalidDocumentError)
        update_allegation_document.when.called_with(crid=None, link=None).should.throw(InvalidDocumentError)

        get_func = Mock()
        get_func.side_effect = RequestException()
        with patch('dashboard.utils.requests.get', new=get_func):
            update_allegation_document.when.called_with('222333', 'http://foo/4-5-6.html')\
                .should.throw(InvalidDocumentError)

        resp_mock = ResponseMock(status.HTTP_404_NOT_FOUND, b'123')
        with patch('dashboard.utils.requests.get', return_value=resp_mock):
            update_allegation_document.when.called_with('222111', 'http://foo/4-5-6.html')\
                .should.throw(InvalidDocumentError)

    def test_get_title_from_document_cloud(self):
        title = 'abc'
        crid = '111222'
        AllegationFactory(crid=crid)
        resp_mock = ResponseMock(status.HTTP_200_OK, ('<title>%s</title>' % title).encode('utf-8'))
        with patch('dashboard.utils.requests.get', return_value=resp_mock):
            update_allegation_document(crid, link='http://abc/1-2-3.html')

        allegation = Allegation.objects.get(crid=crid)
        allegation.document_title.should.equal(title)

    def test_crid_pass_in(self):
        crid = 123456
        document_id = 12
        AllegationFactory(crid=crid)
        link = 'https://abc.xyz/%d-CR-345678.html' % document_id

        actual_crid = update_allegation_document(crid=crid, link=link, test_link=False)
        actual_crid.should.equal(crid)

        allegation = Allegation.objects.get(crid=actual_crid)
        allegation.document_id.should.equal(document_id)
