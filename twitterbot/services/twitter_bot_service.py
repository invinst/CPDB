from twitterbot.services.twitter_bot_names_service import TwitterBotNamesService
from twitterbot.services.twitter_bot_responses_service import TwitterBotResponsesService
from twitterbot.services.twitter_bot_statuses_service import TwitterBotStatusesService
from twitterbot.utils.log import bot_log


class TwitterBotService:
    def __init__(self, api, current_user):
        self.api = api
        self.user = current_user
        self.statuses = []
        self.names = []

    def build_responses(self, status):
        self.cache_all_related_statuses(status)
        self.cache_names()

        responses = self.get_responses()
        recipients = self.get_recipients()
        originating_tweet = self.get_originating_tweet()

        bot_log('No. responses: {num}'.format(num=len(responses)))
        bot_log('No. user responses: {num}'.format(num=len(responses) * len(recipients)))

        for response in responses:
            response.recipients = recipients
            response.incoming_tweet = status
            response.originating_tweet = originating_tweet

        return responses

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

        return [x for x in set(screen_names) if x != self.user.screen_name]

    def get_responses(self):
        """
        Get list of responses we will send to each user
        :param status:
        :return:
        """
        return TwitterBotResponsesService(self.names).build_responses()

    def get_originating_tweet(self):
        if len(self.statuses) > 1:
            originating_tweet = self.statuses[0]

            for status in self.statuses[1:]:
                if status.created_at < originating_tweet.created_at:
                    originating_tweet = status

            return originating_tweet
        else:
            return None
