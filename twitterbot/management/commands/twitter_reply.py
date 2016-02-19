from django.core.management.base import BaseCommand

from common.models import Officer, Investigator
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.models import TwitterSearch, Response, TwitterResponse


class Command(BaseCommand):
    help = 'Post Twitter replies'

    @classmethod
    def create_responses(cls, try_officer_name):
        responses = []

        investigator_results = SuggestInvestigator.query(try_officer_name)
        if investigator_results['Investigator']:
            response = Response.objects.get(type='investigator')
            obj = Investigator.objects.get(pk=investigator_results['Investigator'][0]['tag_value']['value'])
            context = investigator_results['Investigator'][0]['tag_value']
            responses.append((response, obj, context))

        officer_results = SuggestOfficerName.query(try_officer_name)
        if officer_results['Officer']:
            response = Response.objects.get(type='officer')
            obj = Officer.objects.get(pk=officer_results['Officer'][0]['tag_value']['value'])
            context = officer_results['Officer'][0]['tag_value']
            responses.append((response, obj, context))

        return responses

    @classmethod
    def create_not_found_response(cls):
        return Response.objects.get(type='not_found')

    def handle(self, *args, **options):
        for search in TwitterSearch.objects.all():
            data = search.search()

            statuses = data.get('statuses', [])

            for status in statuses:

                splitted = status['text'].split(" ")

                max_index = len(splitted)

                not_found = True
                for i in range(max_index - 1):
                    try_officer_name = " ".join(splitted[i:i+2])
                    responses = Command.create_responses(try_officer_name)
                    not_found = False if responses else True

                    for response, obj, context in responses:
                        context['user'] = status['user']['screen_name']
                        context['obj'] = obj
                        msg = response.get_message(context)

                        tweet = TwitterResponse.objects.create(search=search, response=msg, user=context['user'])
                        tweet.send()

                if not_found:
                    response = Command.create_not_found_response()
                    context = {
                        'user': status['user']['screen_name'],
                        'obj': status['text']
                    }
                    msg = response.get_message(context)
                    tweet = TwitterResponse.objects.create(search=search, response=msg, user=context['user'])
                    tweet.send()

            if 'search_metadata' in data:
                search.refresh_url = data['search_metadata']['refresh_url']
                search.save()
