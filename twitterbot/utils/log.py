import os
import logging


def bot_log(message):
    if os.environ.get('TWITTER_DEBUG', None) == 'true':
        logging.info(message)
