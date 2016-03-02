from rest_framework import status

import requests
from requests.exceptions import RequestException

from common.models import Allegation
from dashboard.exceptions import InvalidDocumentError


def update_allegation_document(crid, link, title=None, test_link=True):
    if not link:
        raise InvalidDocumentError()

    try:
        document_id, crid_part, normalized_title = \
            parse_document_link(link)
    except IndexError:
        raise InvalidDocumentError()

    crid = crid or crid_part

    if test_link:
        try:
            get_title_resp = requests.get(link)
        except RequestException:
            raise InvalidDocumentError()
        if get_title_resp.status_code == status.HTTP_404_NOT_FOUND:
            raise InvalidDocumentError('Document not exist')
        if not title:
            title = get_title(get_title_resp.content.decode())

    Allegation.objects.filter(crid=crid).update(
        document_id=document_id,
        document_normalized_title=normalized_title, document_title=title)

    return crid


def get_title(body):
    title_tag = '<title>'
    end_title_tag = '</title>'
    title_tag_idx = body.find(title_tag)
    end_title_tag_idx = body.find(end_title_tag)

    return body[title_tag_idx+len(title_tag):end_title_tag_idx]


def parse_document_link(link):
    # Example link: https://www.documentcloud.org/documents/1273509-cr-1002643.html
    link_parts = link.split('/')[-1].split('.')[0].split('-')
    document_id_part = link_parts[0]
    crid_part = link_parts[2]
    normalized_title = '-'.join(link_parts[1:])

    return document_id_part, crid_part, normalized_title
