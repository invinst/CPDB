from django.http.response import HttpResponseBadRequest, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic.base import View

from common.json_serializer import JSONSerializer
from common.models import Officer


class StoryView(View):
    def get(self, request):
        officer_id = request.GET.get('officer')
        if not officer_id:
            return HttpResponseBadRequest()

        officer = get_object_or_404(Officer, pk=officer_id)

        stories = officer.story_set.order_by('-custom_order', '-created_date')

        stories = stories[:4]

        content = {
            'stories': stories,
            'success': True,
        }
        content = JSONSerializer().serialize(content)

        return HttpResponse(content, content_type='application/json')
