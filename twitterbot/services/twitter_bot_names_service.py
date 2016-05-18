import collections
import requests
from bs4 import BeautifulSoup
import re

from twitterbot.models import TwitterBotTextSource


class TwitterBotNamesService:
    def __init__(self, tweets):
        self.tweets = tweets

    def get_all_names(self):
        names = collections.defaultdict(lambda: [])
        text_sources = self.build_text_sources()
        for text_source in text_sources:
            for name, source in text_source.build_names():
                names[name].append(source)

        return names

    def build_text_sources(self):
        text_sources = []
        for tweet in self.tweets:
            if not getattr(tweet, 'retweeted_tweet', None):
                text_sources.append(TwitterBotTextSource(text=tweet.text, source='text'))
                text_sources += self.parse_linked_websites(tweet.entities['urls'])
                text_sources += self.parse_hashtags(tweet)

        return text_sources

    def parse_linked_websites(self, urls):
        texts = []

        for url in urls:
            response = requests.get(url['expanded_url'], headers={'User-Agent': 'Mozilla/5.0'})
            html = response.content.decode('utf-8')
            soup = BeautifulSoup(html)
            [s.extract() for s in soup([
                'style',
                'script',
                '[document]',
                'head',
                'title'
            ])]

            text = soup.getText()
            if 'CPD' in text or ('Chicago' in text and 'Police' in text):
                text_source = TwitterBotTextSource(text=text, source=url['expanded_url'])
                texts.append(text_source)

        return texts

    def parse_hashtags(self, tweet):
        hashtags = tweet.entities.get('hashtags', [])
        text_sources = []

        for hashtag in hashtags:
            words = re.findall('[A-Z][a-z]*', hashtag['text'])
            text_sources.append(TwitterBotTextSource(text=' '.join(words), source='#%s' % hashtag['text']))

        return text_sources
