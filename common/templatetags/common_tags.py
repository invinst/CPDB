"""
Created on Jul 29, 2013

@author: antipro
"""
from django import template

from api.models import Setting


register = template.Library()


@register.filter('default_site_title')
def default_site_title(title):
    try:
        return title or Setting.objects.get(key='DEFAULT_SITE_TITLE').value
    except Setting.DoesNotExist:
        return Setting.DEFAULT_SITE_TITLE
