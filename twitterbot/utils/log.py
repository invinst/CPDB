import os


def bot_log(message, e):
    if os.environ.get('TWITTER_DEBUG', None) == 'true':
        print(message)
