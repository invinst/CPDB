from django.contrib import admin

from twitterbot.models import TwitterSearch, Response

admin.site.register(TwitterSearch, admin.ModelAdmin)
admin.site.register(Response, admin.ModelAdmin)
