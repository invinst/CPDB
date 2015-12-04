from django.http.response import HttpResponseRedirect
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from mobile.services.mobile_suggestion_service import MobileSuggestionService


def handler404(request):
    return HttpResponseRedirect("/")


class LookupView(APIView):
    def get(self, request, query):
        suggestion_service = MobileSuggestionService()

        allegation = suggestion_service.suggest_crid(query)
        officer_by_star = suggestion_service.suggest_officer_star(query)
        officers_by_name = suggestion_service.suggest_officer_name(query)

        result_count = 1 if allegation else 0
        result_count += 1 if officer_by_star else 0
        result_count += len(officers_by_name) if officers_by_name else 0

        if result_count != 1:
            url = reverse('home', args=[], request=request) + 'search/{query}'.format(query=query)
            return HttpResponseRedirect(url)

        officer = officer_by_star

        if not officer:
            officer = officers_by_name.first() if officers_by_name else None

        if officer:
            param = 'officer/%s/%s' % (officer.display_name, officer.pk)
            url = reverse('homepage', args=[param], request=request)
            return HttpResponseRedirect(url)
        else:
            param = 'complaint/%s' % allegation.crid
            url = reverse('homepage', args=[param], request=request)
            return HttpResponseRedirect(url)
