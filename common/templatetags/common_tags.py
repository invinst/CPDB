"""
Created on Jul 29, 2013

@author: antipro
"""
from django import template
from django.core.urlresolvers import reverse
from allegation.views import DEFAULT_SITE_TITLE


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
    else:
        return DEFAULT_SITE_TITLE

class CurrentBackUrlNode(template.Node):
    def render(self, context):
        request = context['request']
        if request.get_full_path().startswith(reverse('logout')):
            return ''
        return '?next=%s' % request.get_full_path()
