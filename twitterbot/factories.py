import random

import factory

from twitterbot.models import Response, TYPE_CHOICES


class ResponseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Response

    response_type = factory.Sequence(lambda n: random.choice(TYPE_CHOICES))
    message = factory.Sequence(lambda n: n)


class TweetFactory(object):
    def __init__(self, screen_name='tweeter', text='Random text here', retweeted_status=None, quoted_status=None,
                 quoted_status_id_str='', **kwargs):
        self.text = text
        self.entities = {'user_mentions': kwargs.get('user_mentions', [{'screen_name': screen_name}]),
                         'urls': kwargs.get('urls', []),
                         'hashtags': kwargs.get('hashtags', [])}
        self.user = type('obj', (object,), {'screen_name': screen_name})
        self.retweeted_status = retweeted_status
        self.quoted_status = quoted_status
        self.quoted_status_id_str = quoted_status_id_str


def QuotedTweetFactory(screen_name='tweeter', text='Random text here', retweeted_status=None, quoted_status=None,
                       quoted_status_id_str='', **kwargs):
    return {
        'text': text,
        'entities': {'user_mentions': kwargs.get('user_mentions', [{'screen_name': screen_name}]),
                     'urls': kwargs.get('urls', []),
                     'hashtags': kwargs.get('hashtags', [])},
        'user': {'screen_name': screen_name},
        'retweeted_status': retweeted_status,
        'quoted_status': quoted_status,
        'quoted_status_id_str': quoted_status_id_str
    }
