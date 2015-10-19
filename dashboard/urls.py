from django.conf.urls import url, include
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers

from dashboard.views.alias_view import AdminAliasApi
from dashboard.views.allegation_request_view import AdminAllegationRequestViewSet
from dashboard.views.officer_view import AdminOfficerViewSet
from dashboard.views.query_data_view import AdminQueryDataApi
from dashboard.views.search_traffic import AdminSearchTrafficApi
from dashboard.views.sessions_view import AdminSessionsView
from dashboard.views.story_view import AdminStoryViewSet
from dashboard.views.document_link_view import DocumentLinkView
from dashboard.views.story_type_view import StoryTypeView

cache_view = cache_page(86400 * 90)


router = routers.DefaultRouter()
router.register(r'officers', AdminOfficerViewSet)
router.register(r'stories', AdminStoryViewSet)
router.register(r'document-requests', AdminAllegationRequestViewSet)
router.register(r'sessions', AdminSessionsView)


urlpatterns = [
    url(r'^api/dashboard/search-traffic/$', login_required(AdminSearchTrafficApi.as_view()), name='dashboard-search-traffic'),
    url(r'^api/dashboard/query-data/$', login_required(AdminQueryDataApi.as_view()), name='dashboard-query-data'),
    url(r'^api/dashboard/alias/$', login_required(csrf_exempt(AdminAliasApi.as_view())), name='dashboard-alias'),
    url(r'^api/dashboard/', include(router.urls)),
    url(r'^api/dashboard/document-link/$', login_required(csrf_exempt(DocumentLinkView.as_view()))),
    url(r'^api/dashboard/story_types/$', login_required(csrf_exempt(StoryTypeView.as_view()))),
]
