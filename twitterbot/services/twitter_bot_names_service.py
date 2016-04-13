import requests
from bs4 import BeautifulSoup
import re


class TwitterBotNamesService:
    def __init__(self, statuses):
        self.statuses = statuses

    def get_all_names(self):
        return self.find_names(word_length=2) + self.find_names(word_length=3)

    def find_names(self, word_length=2):
        # TODO: We need to find a new way to get name
        texts = []
        names = []

        for status in self.statuses:
            texts.append(status.text)
            texts += self.parse_linked_websites(status.entities['urls'])
            texts += self.parse_hashtags(status)

        for text in texts:
            text = self.sanitize_text(text)

            splitted = text.split(' ')
            max_index = len(splitted)

            for i in range(max_index - (word_length - 1)):
                name = ' '.join(splitted[i:i+word_length])
                if name and name != ' ' and len(name) > 6:
                    names.append(name)

        return names

    def sanitize_text(self, text):
        text = re.sub('(\t|\n|\r|\s)+', ' ', text)
        text = re.sub('[^A-Za-z0-9]+', ' ', text)
        text = text.strip()

        return text

    def parse_linked_websites(self, urls):
        texts = []

        for url in urls:
            response = requests.get(url['expanded_url'])
            html = response.content.decode('utf-8')
            soup = BeautifulSoup(html)
            [s.extract() for s in soup([
                'style',
                'script',
                '[document]',
                'head',
                'title'
            ])]

            texts.append(soup.getText())

        if len(texts) > 0 and ('CPD' in texts[0] or ('Chicago' in texts[0] and 'Police' in texts[0])):
            return texts
        return []

    def parse_hashtags(self, status):
        hashtags = status.entities.get('hashtags', [])
        words = []

        for hashtag in hashtags:
            words += re.findall('[A-Z][a-z]*', hashtag['text'])

        return [' '.join(words)]
