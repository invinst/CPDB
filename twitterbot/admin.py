from django.contrib import admin

from twitterbot.models import ResponseTemplate, TwitterBotError


admin.site.register(ResponseTemplate, admin.ModelAdmin)
admin.site.register(TwitterBotError, admin.ModelAdmin)
