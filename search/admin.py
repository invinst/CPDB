from django.contrib import admin

from common.actions import make_export_action
from search.models.alias import Alias
from search.models import SuggestionLog
from search.models.session_alias import SessionAlias


class AliasAdmin(admin.ModelAdmin):
    list_display = ('id', 'alias', 'target')
    actions = make_export_action("Export Alias to CSV")


class SuggestionAdmin(admin.ModelAdmin):
    search_fields = ['search_query', 'session_id']
    list_filter = ['num_suggestions']
    list_display = ['session_hash', 'search_query', 'num_suggestions', 'created_at']
    actions = make_export_action("Export Suggestions to CSV")

    def session_hash(self, obj):
        return obj.session_id[:6]

    def failed_suggestions(self):
        return SuggestionLog.objects.all()

    def get_queryset(self, request):
        return SuggestionLog.objects.exclude(session_id__isnull=True).exclude(session_id__exact='')


class SessionAliasAdmin(admin.ModelAdmin):
    list_display = ('id', 'alias', 'session')
    search_fields = ('alias',)


admin.site.register(Alias, AliasAdmin)
admin.site.register(SuggestionLog, SuggestionAdmin)
admin.site.register(SessionAlias, SessionAliasAdmin)
