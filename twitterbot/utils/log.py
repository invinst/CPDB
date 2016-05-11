import os

import unicodedata


def bot_log(message):
    if os.environ.get('TWITTER_DEBUG', None) == 'true':
        message = unicodedata.normalize('NFKD', message).encode('ascii', 'ignore')
        print(message)
