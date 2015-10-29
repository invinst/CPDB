"""
Created on Jul 29, 2013

@author: antipro
"""
from django import template
from django.core.urlresolvers import reverse

from api.models import Setting


register = template.Library()
css_files = []
js_files = []

@register.tag
def current_as_back_url(_, __):
    return CurrentBackUrlNode()

@register.filter('default_site_title')
def default_site_title(title):
    if title:
        return title
    try:
        return Setting.objects.get(key='DEFAULT_SITE_TITLE').value
    except Setting.DoesNotExist:
        return Setting.DEFAULT_SITE_TITLE

class CurrentBackUrlNode(template.Node):
    def render(self, context):
        request = context['request']
        if request.get_full_path().startswith(reverse('logout')):
            return ''
        return '?next=%s' % request.get_full_path()
