from django.core.management.base import BaseCommand

from common.models import Officer, Investigator
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.models import TwitterSearch, Response, TwitterResponse


class Command(BaseCommand):
    help = 'Post Twitter replies'

    @classmethod
    def create_response(cls, try_officer_name):
        response = False
        obj = None
        context = None

        results = SuggestInvestigator.query(try_officer_name)
        if results['Investigator']:
            response = Response.objects.get(type='investigator')
            obj = Investigator.objects.get(pk=results['Investigator'][0]['tag_value']['value'])
            context = results['Investigator'][0]['tag_value']

        results = SuggestOfficerName.query(try_officer_name)
        if results['Officer']:
            response = Response.objects.get(type='officer')
            obj = Officer.objects.get(pk=results['Officer'][0]['tag_value']['value'])
            context = results['Officer'][0]['tag_value']

        return response, obj, context

    def handle(self, *args, **options):
        for search in TwitterSearch.objects.all():
            data = search.search()

            statuses = data.get('statuses', [])

            for status in statuses:

                splitted = status['text'].split(" ")

                max_index = len(splitted)

                for i in range(max_index - 1):

                    try_officer_name = " ".join(splitted[i:i+2])
                    response, obj, context = Command.create_response(try_officer_name)

                    if response:
                        context['user'] = status['user']['screen_name']
                        context['obj'] = obj
                        msg = response.get_message(context)

                        tweet = TwitterResponse.objects.create(search=search, response=msg, user=context['user'])
                        tweet.send()

            if 'search_metadata' in data:
                search.refresh_url = data['search_metadata']['refresh_url']
                search.save()
