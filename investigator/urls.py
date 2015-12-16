from django.conf.urls import url
from django.views.decorators.cache import cache_page

from investigator.views.investigator_detail_view import InvestigatorDetailView
from investigator.views.timeline_view import TimelineView

cache_view = cache_page(86400)


urlpatterns = [
    url(r'^timeline/$', cache_view(TimelineView.as_view()), name='timeline'),
    url(r'^$',
        cache_view(InvestigatorDetailView.as_view()),
        name='detail'),
]
