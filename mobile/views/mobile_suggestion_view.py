from django.http import HttpResponseNotFound, Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from mobile.serializers.meta_serializer import SuggestibleSerializer
from mobile.services.mobile_suggestion_service import *


class MobileSuggestionView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        suggestions = suggest(query)

        if not suggestions:
            raise Http404()

        content = SuggestibleSerializer(suggestions, many=True)
        return Response(content.data)
