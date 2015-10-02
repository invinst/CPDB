from django.views.generic.base import View
import requests

from common.models import Allegation
from document.response import JsonResponse, HttpResponseBadRequest
from document.utils import send_document_notification_by_crid_and_link


class DocumentLinkView(View):
    def post(self, request):
        link = request.POST.get('link', None)
        crid = request.POST.get('crid', None)
        if not link:
            return HttpResponseBadRequest()

        try:
            # Example link: https://www.documentcloud.org/documents/1273509-cr-1002643.html
            link_parts = link.split('/')[-1].split('.')[0].split('-')
            document_id = link_parts[0]
            crid = crid or link_parts[2]
            normalized_title = '-'.join(link_parts[1:])
        except IndexError:
            return HttpResponseBadRequest()

        get_title_resp = requests.get(link)
        if get_title_resp.status_code == 404:
            return HttpResponseBadRequest(content={
                'errors': ['Document not exist']
            })
        title = self.get_title(get_title_resp.content.decode())

        allegations = Allegation.objects.filter(crid=crid)
        allegations.update(document_id=document_id, document_normalized_title=normalized_title, document_title=title)

        send_document_notification_by_crid_and_link(crid, link)

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
