__author__ = 'antipro'
from django.template import Library

register = Library()


@register.filter
def replace(var, args):
    if args is None:
        return False
    old, new = args.split(',')
    return var.replace(old, new)
