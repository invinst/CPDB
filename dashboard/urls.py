from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page

from dashboard.views.search_traffic import AdminSearchTrafficApi


cache_view = cache_page(86400 * 90)


urlpatterns = [
    url(r'^api/dashboard/search-traffic/$', login_required(AdminSearchTrafficApi.as_view()), name='dashboard-search-traffic'),
]
