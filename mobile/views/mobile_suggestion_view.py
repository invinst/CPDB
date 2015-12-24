from rest_framework.response import Response
from rest_framework.views import APIView

from mobile.serializers.meta_serializer import SuggestibleSerializer
from mobile.services.mobile_suggestion_service import *


class MobileSuggestionView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        content = SuggestibleSerializer(suggest(query), many=True)
        return Response(content.data)
