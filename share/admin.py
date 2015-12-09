import json

from django.contrib import admin
from django.utils.html import format_html

from common.actions import make_export_action
from share.models import Session


class ShareSessionAdmin(admin.ModelAdmin):
    search_fields = ['query']
    list_display = ['hash_id', 'session_type', 'session_title', 'search_tags', 'shared_from', 'shared_to']
    actions = make_export_action("Export Shares to CSV")

    def format_as_session_link(self, obj):
        return format_html("<a href='/dashboard/share/session/{}'>{}</a>", obj.id, obj.hash_id)

    def shared_from(self, obj):
        if obj.share_from:
            return self.format_as_session_link(obj)
        else:
            return ''

    def session_type(self, obj):
        if obj.share_from or self.shared_to(obj):
            return 'Shared'
        else:
            return 'Fresh'

    def session_title(self, obj):
        if 'title' in obj.query:
            return obj.query['title']
        else:
            return 'Chicago Police Database'

    def shared_to(self, obj):
        results = []
        shared_tos = Session.objects.filter(share_from__exact=obj.id)

        for session in shared_tos:
            results.append(self.format_as_session_link(session))

        return ', '.join(results)

    def search_tags(self, obj):
        tags = []
        queries = []

        if 'filters' in obj.query:
            queries = obj.query['filters']

        for filter_type in queries:
            if 'value' in queries[filter_type]:
                for tag in queries[filter_type]['value']:
                    tags.append(str(tag))

        return ', '.join(tags)

    def get_queryset(self, request):
        return Session.objects.all()

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super(ShareSessionAdmin, self).get_search_results(request, queryset, search_term)
        id = Session.id_from_hash(search_term)
        if id:
            queryset = Session.objects.filter(id=id[0])

        return queryset, use_distinct

    shared_from.allow_tags = True
    shared_to.allow_tags = True


admin.site.register(Session, ShareSessionAdmin)
