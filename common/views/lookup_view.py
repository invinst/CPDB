from django.views.generic import RedirectView

from mobile.services.mobile_suggestion_service import *


class LookupView(RedirectView):
    def get_default_search_url(self, query):
        uri = '/mobile/search/{query}'.format(query=query)
        return self.request.build_absolute_uri(uri)

    @staticmethod
    def query_param(query):
        return query.replace('+', ' ').replace('_', ' ').replace('-', ' ')

    def get_redirect_url(self, *args, **kwargs):
        query = kwargs.get('query', '')
        suggestions = suggest(LookupView.query_param(query))
        default_url = self.get_default_search_url(query)

        return default_url if len(suggestions) != 1 else suggestions[0]['url']
