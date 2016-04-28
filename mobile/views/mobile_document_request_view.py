from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from mobile.serializers.mobile_document_request_view_serializer import MobileDocumentRequestViewSerializer


class MobileDocumentRequestView(APIView):
    renderer_classes = (JSONRenderer,)

    def post(self, request):
        serializer = MobileDocumentRequestViewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
