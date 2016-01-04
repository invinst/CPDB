from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

from mobile.serializers.suggestible_serializer import SuggestibleSerializer
from mobile.services.mobile_suggestion_service import *


class MobileSuggestionView(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request):
        query = request.GET.get('query', '')
        suggestions = suggest(query)

        if not suggestions:
            raise Http404()

        content = SuggestibleSerializer(suggestions, many=True)
        return Response(content.data)
