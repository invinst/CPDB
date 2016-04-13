from django.core.management.base import BaseCommand

from twitterbot.twitter_bot import TwitterBot


class Command(BaseCommand):
    def handle(self, *args, **options):
        bot = TwitterBot()
        bot.start()
