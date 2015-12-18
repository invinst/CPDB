from django.conf.urls import url
from django.views.decorators.cache import cache_page

from investigator.views.investigator_detail_view import InvestigatorDetailView

cache_view = cache_page(86400)


urlpatterns = [
    url(r'^$',
        cache_view(InvestigatorDetailView.as_view()),
        name='detail'),
]
