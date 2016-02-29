import random

import factory

from twitterbot.models import Response, TYPE_CHOICES


class ResponseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Response

    type = factory.Sequence(lambda n: random.choice(TYPE_CHOICES))
    message = factory.Sequence(lambda n: n)


class TweetFactory(object):
    def __init__(self, **kwargs):
        screen_name = kwargs.get('screen_name', 'tweeter')

        self.text = kwargs.get('text', "Random text here")
        self.entities = {'user_mentions': [{'screen_name': screen_name}],
                         'urls': kwargs.get('urls', []),
                         'hashtags': kwargs.get('hashtags', [])}
        self.user = type('obj', (object,), {'screen_name': screen_name})
        self.retweeted_status = kwargs.get('retweeted_status', None)
