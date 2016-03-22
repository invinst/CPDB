from django.contrib import admin

from twitterbot.models import TwitterSearch, Response, TwitterResponse, TwitterBotError


class TwitterResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'response')


admin.site.register(TwitterSearch, admin.ModelAdmin)
admin.site.register(Response, admin.ModelAdmin)
admin.site.register(TwitterResponse, TwitterResponseAdmin)
admin.site.register(TwitterBotError, admin.ModelAdmin)
