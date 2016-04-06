from mock import patch, MagicMock

from common.tests.core import SimpleTestCase
from dashboard.services.documentcloud_service import DocumentcloudService


class DocumentcloudServiceTestCase(SimpleTestCase):
    def test_upload_document(self):
        title = 'title'
        source = 'source'
        file = 'file'
        auth = 'auth'

        auth_func = MagicMock(return_value=auth)
        with patch('dashboard.services.documentcloud_service.HTTPBasicAuth', new=auth_func):
            with patch('dashboard.services.documentcloud_service.requests.post') as mock_post:
                DocumentcloudService().upload_document(title, source, file)

                mock_post.assert_called_once_with(
                    'https://www.documentcloud.org/api/upload.json',
                    auth=auth,
                    files={'file': ('%s.pdf' % title, file, 'application/pdf')},
                    data={
                        'title': title,
                        'access': 'public',
                        'source': source
                    }
                )
