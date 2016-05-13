from django.conf import settings
from django.core.management.base import BaseCommand
from responsebot.responsebot import ResponseBot


class Command(BaseCommand):
    def handle(self, *args, **options):
        options['consumer_key'] = settings.TWITTER_CONSUMER_KEY
        options['consumer_secret'] = settings.TWITTER_CONSUMER_SECRET
        options['token_key'] = settings.TWITTER_APP_TOKEN_KEY
        options['token_secret'] = settings.TWITTER_APP_TOKEN_SECRET
        options['handlers_package'] = 'twitterbot.handlers'
        options['user_stream'] = True

        bot = ResponseBot(*args, **options)
        bot.start()
