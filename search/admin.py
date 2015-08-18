from django.contrib import admin

from search.models.alias import Alias


class AliasAdmin(admin.ModelAdmin):
    list_display = ('id', 'alias', 'target')


admin.site.register(Alias, AliasAdmin)
