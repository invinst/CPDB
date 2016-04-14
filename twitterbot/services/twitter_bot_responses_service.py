from twitterbot.services.responses.officers import OfficerResponses


class TwitterBotResponsesService:
    REPLY_LIMIT = 10

    def __init__(self, names):
        self.names = names

    def build_responses(self):
        responses = OfficerResponses(self.names).build_responses()
        # Temporary disable investigator response since mobile version doesn't have investigator page yet
        # responses += InvestigatorResponses(self.names).build_responses()

        return responses[:self.REPLY_LIMIT]
