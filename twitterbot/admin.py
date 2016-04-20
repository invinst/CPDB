from django.contrib import admin

from twitterbot.models import ResponseTemplate, TwitterBotError, TwitterBotResponseLog


class TwitterBotErrorAdmin(admin.ModelAdmin):
    list_display = ('stack_trace', 'timestamp')


class TwitterBotResponseLogAdmin(admin.ModelAdmin):
    list_display = ('tweet_url', 'tweet_content', 'tweeted_at',
                    'incoming_tweet_username', 'incoming_tweet_url', 'incoming_tweet_content',
                    'originating_tweet_username', 'originating_tweet_url', 'originating_tweet_content',
                    'entity_url', 'matched_strings')

admin.site.register(ResponseTemplate, admin.ModelAdmin)
admin.site.register(TwitterBotError, TwitterBotErrorAdmin)
admin.site.register(TwitterBotResponseLog, TwitterBotResponseLogAdmin)
