from django.contrib import admin

from twitterbot.models import ResponseTemplate, TwitterBotError


class TwitterResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'response')


admin.site.register(ResponseTemplate, admin.ModelAdmin)
admin.site.register(TwitterBotError, admin.ModelAdmin)
