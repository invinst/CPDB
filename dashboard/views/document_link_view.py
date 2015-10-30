from django.views.generic.base import View
import requests
from requests.exceptions import RequestException

from common.models import Allegation
from document.response import JsonResponse, HttpResponseBadRequest
from document.tasks import send_document_notification_by_crid_and_link


class DocumentLinkView(View):
    def post(self, request):
        link = request.POST.get('link', None)
        crid = request.POST.get('crid', None)

        if link is None:
            return self.cancle_requests(crid)

        return self.update_allegation_document(crid, link)

    def cancle_requests(self, crid):
        allegations = Allegation.objects.filter(crid=crid)
        allegations.update(document_requested=False)
        return JsonResponse()

    def update_allegation_document(self, crid, link):
        if not link:
            return HttpResponseBadRequest()

        try:
            document_id, crid_part, normalized_title = self.parse_document_link(link)
        except IndexError:
            return HttpResponseBadRequest()

        crid = crid or crid_part

        try:
            get_title_resp = requests.get(link)
        except RequestException:
            return HttpResponseBadRequest()
        if get_title_resp.status_code == 404:
            return HttpResponseBadRequest(content={
                'errors': ['Document not exist']
            })
        title = self.get_title(get_title_resp.content.decode())

        allegations = Allegation.objects.filter(crid=crid)
        allegations.update(document_id=document_id, document_normalized_title=normalized_title, document_title=title)

        send_document_notification_by_crid_and_link.delay(crid, link)

        return JsonResponse({
            'status': 200,
            'crid': crid
        })

    def get_title(self, body):
        title_tag = '<title>'
        end_title_tag = '</title>'
        title_tag_idx = body.find(title_tag)
        end_title_tag_idx = body.find(end_title_tag)

        return body[title_tag_idx+len(title_tag):end_title_tag_idx]

    def parse_document_link(self, link):
        # Example link: https://www.documentcloud.org/documents/1273509-cr-1002643.html
        link_parts = link.split('/')[-1].split('.')[0].split('-')
        document_id_part = link_parts[0]
        crid_part = link_parts[2]
        normalized_title = '-'.join(link_parts[1:])

        return document_id_part, crid_part, normalized_title
