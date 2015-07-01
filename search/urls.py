from django.conf.urls import url
from django.views.decorators.cache import cache_page

from search.views.suggest_view import SuggestView


cache_view = cache_page(86400)


urlpatterns = [
    url(r'^suggest/$', cache_view(SuggestView.as_view()), name='suggest'),
]
