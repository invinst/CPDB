from django.conf import settings

import requests
from requests.auth import HTTPBasicAuth


def upload_cr_document(title, source, file):
    resp = requests.post(
        'https://www.documentcloud.org/api/upload.json',
        auth=HTTPBasicAuth(settings.DOCUMENT_CLOUD_USERNAME, settings.DOCUMENT_CLOUD_PASSWORD),
        files={'file': ('%s.pdf' % title, file, 'application/pdf')},
        data={
            'title': title,
            'access': 'public',
            'source': source})

    return (resp.status_code, resp.json())
