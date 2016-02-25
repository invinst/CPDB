from django.core.management.base import BaseCommand

from twitterbot.utils import TwitterBot


class Command(BaseCommand):
    def handle(self, *args, **options):
        bot = TwitterBot()
        bot.start()
