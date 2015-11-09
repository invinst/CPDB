from django.contrib import admin

from common.actions import make_export_action
from officer import models


class StoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ('id', 'title', 'officer', 'created_date', 'custom_order')
    list_display_links = ('id', 'title')
    search_fields = ('title',)
    actions = make_export_action("Export Officer Stories to CSV")

admin.site.register(models.Story, StoryAdmin)
