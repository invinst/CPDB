from rest_framework.response import Response
from rest_framework.views import APIView

from mobile.serializers.mobile_suggestion_serializer import MobileSuggestionSerializer
from mobile.services.mobile_suggestion_service import MobileSuggestionService


class MobileSuggestionView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        suggestion_service = MobileSuggestionService()

        content = MobileSuggestionSerializer({
            'allegation': suggestion_service.suggest_crid(query),
            'officer_by_star': suggestion_service.suggest_officer_star(query),
            'officers_by_name': suggestion_service.suggest_officer_name(query)
        }, context={'request': request})

        return Response(content.data)
