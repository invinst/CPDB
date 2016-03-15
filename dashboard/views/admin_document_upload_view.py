import re

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser

from dashboard.utils.document_cloud_utils import upload_cr_document
from dashboard.utils import update_allegation_document
from dashboard.exceptions import InvalidDocumentError


class AdminDocumentUploadView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request):
        resp_status, resp_content = upload_cr_document(
            request.data['title'], request.data.get('source', ''), request.data['file'])
        if resp_status == status.HTTP_200_OK:
            crid = re.findall(r'\d{6}', request.data['title'])[0]
            url = resp_content['canonical_url']
            try:
                crid = update_allegation_document(
                    crid=crid, link=url, title=request.data['title'], test_link=False)
            except InvalidDocumentError as e:
                return Response({'errors': [e.message]}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'crid': crid})
        else:
            return Response({'documentCloudMessage': resp_content}, status=status.HTTP_400_BAD_REQUEST)
