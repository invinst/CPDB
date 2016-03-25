import re

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser

from dashboard.services.documentcloud_service import DocumentcloudService
from dashboard.exceptions import InvalidDocumentError
from document.models import Document


class AdminDocumentUploadView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request):
        documentcloud_service = DocumentcloudService()

        resp_status, resp_content = documentcloud_service.upload_document(
            request.data['title'], request.data.get('source', ''), request.data['file'])

        if resp_status == status.HTTP_200_OK:
            crid = re.findall(r'\d+', request.data['title'])[0]
            link = resp_content['canonical_url']

            parsed_link = documentcloud_service.parse_link(link=link)
            try:
                if not parsed_link:
                    raise InvalidDocumentError()

                document = Document.objects.get(allegation__crid=crid, type=request.data['document_type'])
                document.update(
                    documentcloud_id=parsed_link['documentcloud_id'],
                    normalized_title=parsed_link['normalized_title'],
                    title=request.data['title']
                )
            except InvalidDocumentError as e:
                return Response({'errors': [e.message]}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'crid': crid})
        else:
            return Response({'documentCloudMessage': resp_content}, status=status.HTTP_400_BAD_REQUEST)
