from django.conf.urls import url
from django.views.decorators.cache import cache_page

from allegation.views import AllegationListView
from officer.views.count_view import CountView
from officer.views.officer_detail_view import OfficerDetailView
from officer.views.story_view import StoryView
from officer.views.timeline_view import TimelineView


cache_view = cache_page(86400)


urlpatterns = [
    url(r'^count/$', cache_view(CountView.as_view()), name='count'),
    url(r'^timeline/$', cache_view(TimelineView.as_view()), name='timeline'),
    url(r'^stories/$', StoryView.as_view(), name='stories'),
    url(r'^$',
        cache_view(OfficerDetailView.as_view()),
        name='detail'),
    url(r'^(?P<slug>[a-z0-9]+(-[a-z0-9]+)*)/(?P<pk>\d+)$', cache_view(AllegationListView.as_view()), name='view'),
]
