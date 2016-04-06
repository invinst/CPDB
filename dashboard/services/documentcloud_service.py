import re
import requests
from requests.auth import HTTPBasicAuth
from documentcloud import DocumentCloud

from django.conf import settings


class DocumentcloudService(object):
    DOCUMENTCLOUD_LINK_PATTERN = ('https://www.documentcloud\.org/documents/'
                                  '(?P<documentcloud_id>\d+)-(?P<normalized_title>[^/]+)\.html')
    ID_SEARCH_SYNTAX = 'Document: {id}'

    def process_link(self, link, document_type):
        matched_link = self.parse_link(link)
        if matched_link:
            client = DocumentCloud()
            results = client.documents.search(self.ID_SEARCH_SYNTAX.format(id=matched_link['documentcloud_id']))

            if results:
                title = results[0].title
                crid = self.parse_crid_from_title(title, document_type)
                if crid:
                    return {
                        'documentcloud_id': matched_link['documentcloud_id'],
                        'normalized_title': matched_link['normalized_title'],
                        'allegation_crid': crid,
                        'title': title
                    }

        return False

    def parse_link(self, link):
        '''
        Check if this link is valid DocumentCloud link
        Example link: https://www.documentcloud.org/documents/1273509-cr-1002643.html
        '''
        pattern = re.compile(self.DOCUMENTCLOUD_LINK_PATTERN)

        matched = re.match(pattern, link)
        if matched:
            return {
                'documentcloud_id': matched.group('documentcloud_id'),
                'normalized_title': matched.group('normalized_title')
            }

        return False

    def parse_crid_from_title(self, documentcloud_id, document_type='CR'):
        '''
        Parse title to get allegation CRID
        '''
        pattern = re.compile('^CR(-| )(?P<crid>\d+)$')

        if document_type == 'CPB':
            pattern = re.compile('^CPB CR (?P<crid>\d+)$')

        matched = re.match(pattern, documentcloud_id)
        if matched:
            return matched.group('crid')

        return False

    def upload_document(self, title, source, file):
        resp = requests.post(
            'https://www.documentcloud.org/api/upload.json',
            auth=HTTPBasicAuth(settings.DOCUMENT_CLOUD_USERNAME, settings.DOCUMENT_CLOUD_PASSWORD),
            files={'file': ('%s.pdf' % title, file, 'application/pdf')},
            data={
                'title': title,
                'access': 'public',
                'source': source})

        return (resp.status_code, resp.json())
