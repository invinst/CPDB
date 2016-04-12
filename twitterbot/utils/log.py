import os


def bot_log(message):
    if os.environ.get('TWITTER_DEBUG', None) == 'true':
        print(message)
