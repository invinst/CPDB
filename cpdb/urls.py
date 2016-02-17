import debug_toolbar
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from wagtail.contrib.wagtailapi import urls as wagtailapi_urls
from wagtail.wagtailadmin import urls as wagtailadmin_urls
from wagtail.wagtailcore import urls as wagtail_urls
from wagtail.wagtaildocs import urls as wagtaildocs_urls
from wagtail.wagtailsearch import urls as wagtailsearch_urls

from allegation.views import AllegationListView, DataToolView
from allegation.views.session_view import InitSession
from allegation.views.landing_view import LandingView
from dashboard.views.admin_analysis_dashboard_view import AdminAnalysisDashboardView

urlpatterns = [
    url(r'^admin/$', login_required(AdminAnalysisDashboardView.as_view()), name='my-view'),
    url(r'^admin/models/', include(admin.site.urls)),
    url(r'^', include('allegation.urls', namespace='allegation')),
    url(r'^search/', include('search.urls', namespace='search')),
    url(r'^share/', include('share.urls', namespace='share')),
    url(r'^officer/', include('officer.urls', namespace='officer')),
    url(r'^investigator/', include('investigator.urls', namespace='investigator')),
    url(r'^document/', include('document.urls', namespace='document')),
    url(r'^mobile/', include('mobile.urls', namespace='mobile')),
    url(r'^lookup/', include('common.urls', namespace='common')),
    url(r'^embed/', include('embed.urls', namespace='embed')),
    url(r'^api/', include('api.urls')),
    url(r'^api/wagtail/', include(wagtailapi_urls)),
    url(r'^init/', InitSession.as_view(), name='init'),
    url(r'^landing/', LandingView.as_view(), name='landing'),
    url(r'^', include('dashboard.urls')),
    url(r'^/session/(?P<hash_id>[\w-]+)/$', ensure_csrf_cookie(AllegationListView.as_view()), name='homepage-share'),
    url(r'^/session/(?P<hash_id>[\w-]+)/(?P<slugified_url>[\w-]+)$',
        ensure_csrf_cookie(AllegationListView.as_view()), name='homepage-share-with-title'),
    url(r'^(findings|story|method|officer/[^/]+/\d+|investigator/[^/]+/\d+)?/?$',
        ensure_csrf_cookie(AllegationListView.as_view()), name='homepage'),
    url(r'^data/(?P<hash_id>\w{6})/(?P<title_slug>.*)', ensure_csrf_cookie(DataToolView.as_view()), name='datatool'),
    url(r'^wagtail-admin/', include(wagtailadmin_urls)),

    url(r'^search/', include(wagtailsearch_urls)),
    url(r'^documents/', include(wagtaildocs_urls)),

    # For anything not caught by a more specific rule above, hand over to
    # Wagtail's serving mechanism
    url(r'^[^/]+/$', ensure_csrf_cookie(AllegationListView.as_view()), name='homepage'),
    url(r'', include(wagtail_urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DJANGO_ENV == 'test':
    urlpatterns += [url(r'^favicon\.ico$', lambda request: HttpResponse())]


handler404 = 'common.views.handler404'

DEBUG_TOOLBAR_URL = [
    url(r'^__debug__/', include(debug_toolbar.urls)),
]
if not settings.DEBUG:
    DEBUG_TOOLBAR_URL = []
urlpatterns += DEBUG_TOOLBAR_URL
