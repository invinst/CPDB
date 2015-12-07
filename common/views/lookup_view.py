from django.http.response import HttpResponseRedirect
from django.views.generic import RedirectView
from rest_framework.reverse import reverse

from mobile.services.mobile_suggestion_service import *


def handler404(request):
    return HttpResponseRedirect("/")


class LookupView(RedirectView):
    def get_default_search_url(self, query):
        search_uri = 'search/{query}'.format(query=query)
        return '{mobile_base_url}{search_uri}'.format(mobile_base_url=reverse('mobile:home'),
                                                      search_uri=search_uri)

    def get_redirect_url(self, *args, **kwargs):
        query = kwargs.get('query', '')
        suggestions = suggest(query)
        default_url = self.get_default_search_url(query)

        return default_url if len(suggestions) != 1 else suggestions[0]['url']
