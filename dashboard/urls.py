from django.conf.urls import url, include
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers

from dashboard.views.admin_allegation_request_analysis_view import AdminAllegationRequestAnalysisView
from dashboard.views.alias_view import AdminAliasApi
from dashboard.views.allegation_request_view import AdminAllegationRequestViewSet
from dashboard.views.officer_view import AdminOfficerViewSet
from dashboard.views.query_data_view import AdminQueryDataApi
from dashboard.views.search_traffic import AdminSearchTrafficApi
from dashboard.views.sessions_view import AdminSessionsView
from dashboard.views.story_view import AdminStoryViewSet
from dashboard.views.settings_view import AdminSettingsView
from dashboard.views.document_request_status_view import DocumentRequestStatusView
from dashboard.views.document_link_view import DocumentLinkView
from dashboard.views.story_type_view import StoryTypeView
from dashboard.views.admin_session_analytics_view import AdminNewSessionsAnalyticsViewSet
from dashboard.views.admin_session_alias_view import AdminSessionAliasApi, AdminSessionsAliasViewSet
from dashboard.views.admin_investigation_documents_export_view import AdminInvestigationDocumentsExportView

cache_view = cache_page(86400 * 90)


router = routers.DefaultRouter()
router.register(r'officers', AdminOfficerViewSet)
router.register(r'stories', AdminStoryViewSet)
router.register(r'document-requests', AdminAllegationRequestViewSet)
router.register(r'sessions', AdminSessionsView)
router.register(r'session-alias2', AdminSessionsAliasViewSet)
router.register(r'new-sessions-analytics', AdminNewSessionsAnalyticsViewSet)
router.register(r'settings', AdminSettingsView)


urlpatterns = [
    url(r'^api/dashboard/search-traffic/$', login_required(AdminSearchTrafficApi.as_view()),
        name='dashboard-search-traffic'),
    url(r'^api/dashboard/query-data/$', login_required(AdminQueryDataApi.as_view()), name='dashboard-query-data'),
    url(r'^api/dashboard/alias/$', login_required(csrf_exempt(AdminAliasApi.as_view())), name='dashboard-alias'),
    url(r'^api/dashboard/', include(router.urls)),
    url(r'^api/dashboard/document-request-status/$', login_required(csrf_exempt(DocumentRequestStatusView.as_view()))),
    url(r'^api/dashboard/document-link/$', login_required(csrf_exempt(DocumentLinkView.as_view()))),
    url(r'^api/dashboard/story_types/$', login_required(csrf_exempt(StoryTypeView.as_view()))),
    url(r'^api/dashboard/document-requests-analysis/$',
        login_required(csrf_exempt(AdminAllegationRequestAnalysisView.as_view())),
        name='dashboard-allegation-request-analysis'),
    url(r'^api/dashboard/session-alias/$', login_required(csrf_exempt(AdminSessionAliasApi.as_view())),
        name='session-alias'),
    url(r'^api/dashboard/documents_export/$',
        login_required(csrf_exempt(AdminInvestigationDocumentsExportView.as_view())), name='documents-export'),
]
