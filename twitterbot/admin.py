from django.contrib import admin

from twitterbot.models import TwitterSearch, Response, TwitterResponse


class TwitterResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'response')


admin.site.register(TwitterSearch, admin.ModelAdmin)
admin.site.register(Response, admin.ModelAdmin)
admin.site.register(TwitterResponse, TwitterResponseAdmin)
