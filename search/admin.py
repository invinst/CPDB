from django.contrib import admin


from search.models.alias import Alias
from search.models import SuggestionLog


class AliasAdmin(admin.ModelAdmin):
    list_display = ('id', 'alias', 'target')

admin.site.register(Alias, AliasAdmin)


class SuggestionAdmin(admin.ModelAdmin):
    search_fields = ['query','session_id']
    list_filter = ['num_suggestions']
    list_display = ['session_hash', 'query', 'num_suggestions', 'created_at']

    def session_hash(self, obj):
        return obj.session_id[:6]

    def failed_suggestions(self):
        return SuggestionLog.objects.all()

    def get_queryset(self, request):
        return SuggestionLog.objects.exclude(session_id__isnull=True).exclude(session_id__exact='')

admin.site.register(SuggestionLog, SuggestionAdmin)
