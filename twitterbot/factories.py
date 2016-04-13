import random

import factory

from twitterbot.models import ResponseTemplate, TYPE_CHOICES


class ResponseTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ResponseTemplate

    response_type = factory.Sequence(lambda n: random.choice(TYPE_CHOICES))
    message = '{user} {{obj}} {reply_to}'


class TweetFactory:
    def __init__(self, screen_name='tweeter', text='Random text here', retweeted_status=None, quoted_status=None,
                 quoted_status_id_str='', tweet_id=1, **kwargs):
        self.text = text
        self.entities = {'user_mentions': kwargs.get('user_mentions', [{'screen_name': screen_name}]),
                         'urls': kwargs.get('urls', []),
                         'hashtags': kwargs.get('hashtags', [])}
        self.user = type('obj', (object,), {'screen_name': screen_name})
        self.retweeted_status = retweeted_status
        self.quoted_status = quoted_status
        self.quoted_status_id_str = quoted_status_id_str
        self.id = tweet_id


def QuotedTweetFactory(screen_name='tweeter', text='Random text here', retweeted_status=None, quoted_status=None,
                       quoted_status_id_str='', tweet_id=1, **kwargs):
    return {
        'text': text,
        'entities': {'user_mentions': kwargs.get('user_mentions', [{'screen_name': screen_name}]),
                     'urls': kwargs.get('urls', []),
                     'hashtags': kwargs.get('hashtags', [])},
        'user': {'screen_name': screen_name},
        'retweeted_status': retweeted_status,
        'quoted_status': quoted_status,
        'quoted_status_id_str': quoted_status_id_str,
        'id': tweet_id
    }
