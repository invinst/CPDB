"""cpdb URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.decorators.csrf import ensure_csrf_cookie

from allegation.views import AllegationListView

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('allegation.urls', namespace='allegation')),
    url(r'^search/', include('search.urls', namespace='search')),
    url(r'^share/', include('share.urls', namespace='share')),
    url(r'^officer/', include('officer.urls', namespace='officer')),
    url(r'^document/', include('document.urls', namespace='document')),
    url(r'^$', ensure_csrf_cookie(AllegationListView.as_view()), name='homepage'),
    url(r'^(?P<hash_id>[\w-]+)/$', ensure_csrf_cookie(AllegationListView.as_view()), name='homepage-share'),
    url(r'^(?P<hash_id>[\w-]+)/(?P<slugified_url>[\w-]+)$', ensure_csrf_cookie(AllegationListView.as_view()), name='homepage-share'),
]
