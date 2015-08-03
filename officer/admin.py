from django.contrib import admin

from officer import models


class StoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ('id', 'title', 'officer', 'created_date', 'custom_order')
    list_display_links = ('id', 'title')
    search_fields = ('title',)

admin.site.register(models.Story, StoryAdmin)
