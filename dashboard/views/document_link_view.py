from django.views.generic.base import View

from common.models import Allegation
from document.response import JsonResponse, HttpResponseBadRequest
from document.tasks import send_document_notification_by_crid_and_link
from dashboard.utils import update_allegation_document
from dashboard.exceptions import InvalidDocumentError


class DocumentLinkView(View):
    def post(self, request):
        link = request.POST.get('link', None)
        crid = request.POST.get('crid', None)

        if link is None:
            return self.cancle_requests(crid)
        try:
            crid = update_allegation_document(crid, link)
        except InvalidDocumentError as e:
            return HttpResponseBadRequest(content={
                'errors': [e.message]
                })

        send_document_notification_by_crid_and_link.delay(crid, link)

        return JsonResponse({
            'status': 200,
            'crid': crid
        })

    def cancle_requests(self, crid):
        Allegation.objects.filter(crid=crid).update(document_requested=False)
        return JsonResponse()
