from django.conf.urls import url
from search.views.suggest_view import SuggestView
from django.views.decorators.cache import cache_page
cache_one_hour = cache_page(3600)


urlpatterns = [
    url(r'^suggest/$', cache_one_hour(SuggestView.as_view()), name='suggest'),
]
