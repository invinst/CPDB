from django.core.urlresolvers import reverse
from django.views.generic import RedirectView

from share.models import Session
from url_mediator.services.session_builder import FilterTags, FromSuggestions, Builder
from url_mediator.services.url_mediator_suggestion_service import UrlMediatorSuggestionService


class AllegationSearchView(RedirectView):
    def get_redirect_url(self, term=None):
        suggestions = UrlMediatorSuggestionService().pick_the_best_matched_for(term)

        if suggestions:
            session_query = Builder(
                FilterTags(
                    FromSuggestions(suggestions=suggestions)
                )).build()
            session = Session(query=session_query)
            session.save()

            return session.get_absolute_url()

        return reverse('homepage')
