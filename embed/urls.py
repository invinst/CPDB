from django.conf.urls import url
from django.views.decorators.cache import cache_page

from embed.tests.views.embed_view import EmbedView


cache_view = cache_page(86400 * 90)


urlpatterns = [
    url(r'^$', cache_view(EmbedView.as_view()), name='embed'),
]
