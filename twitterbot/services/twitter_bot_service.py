from django.conf import settings

from twitterbot.services.twitter_bot_names_service import TwitterBotNamesService
from twitterbot.services.twitter_bot_responses_service import TwitterBotResponsesService
from twitterbot.services.twitter_bot_statuses_service import TwitterBotStatusesService
from twitterbot.utils.log import bot_log


class TwitterBotService:
    def __init__(self, api):
        self.api = api
        self.statuses = []
        self.names = []

    def build_responses(self, status):
        user_responses = []

        self.cache_all_related_statuses(status)
        self.cache_names()

        recipients = self.get_recipients()
        responses = self.get_responses()

        bot_log('Response: {responses}'.format(responses=len(responses)))

        for response in responses:
            for recipient in recipients:
                # For logging purpose => function deprecated
                # query = '@{user}'.format(user=settings.TWITTER_SCREEN_NAME)
                # search, _ = TwitterSearch.objects.get_or_create(query=query)
                # TwitterResponse(search=search, response=response, user=status.user.screen_name).save()
                user_response = response.replace('{user}', recipient)
                user_response = user_response.replace('{tweet_id}', str(status.id))

                user_responses.append(user_response)

        return user_responses

    def cache_all_related_statuses(self, status):
        """
        Cache list of all related statuses including original status
        :param status: incoming status
        :return: list of all statuses we want to process
        """
        self.statuses = TwitterBotStatusesService(self.api).get_all_related_statuses(status)

    def cache_names(self):
        """
        Cache list of names we will check in our database to find officer
        :return:
        """
        self.names = TwitterBotNamesService(self.statuses).get_all_names()

    def get_recipients(self):
        """
        Get list of users we will reply to
        :return:
        """
        screen_names = []
        for status in self.statuses:
            screen_names.append(status.user.screen_name)
            screen_names += [x['screen_name'] for x in status.entities['user_mentions']]

        return [x for x in set(screen_names) if x != settings.TWITTER_SCREEN_NAME]

    def get_responses(self):
        """
        Get list of responses we will send to each user
        :param status:
        :return:
        """
        return TwitterBotResponsesService(self.names).build_responses()
