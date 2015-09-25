from rest_framework import viewsets

from api.serializers.story_serializer import StorySerializer
from dashboard.authentication import SessionAuthentication
from officer.models import Story


class AdminStoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    authentication_classes = (SessionAuthentication,)
    ordering = ('created_date',)

    def get_queryset(self):
        queryset = super(AdminStoryViewSet, self).get_queryset()
        officer = self.request.GET.get('officer')
        if officer:
            queryset = queryset.filter(officer=officer)
        return queryset
