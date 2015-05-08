"""
Created on Jul 29, 2013

@author: antipro
"""
from django import template
from django.core.urlresolvers import reverse


register = template.Library()

css_files = []
js_files = []


@register.tag
def current_as_back_url(_, token):
    return CurrentBackUrlNode()


class CurrentBackUrlNode(template.Node):
    def render(self, context):
        request = context['request']
        if request.get_full_path().startswith(reverse('logout')):
            return ''
        return '?next=%s' % request.get_full_path()
