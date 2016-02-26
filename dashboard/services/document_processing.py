class DocumentProcessing(object):
    def __init__(self, allegation):
        self.allegation = allegation

    def update_link(self, params):
        document, _ = self.allegation.documents.get_or_create(type='CR')

        document.documentcloud_id = params['documentcloud_id']
        document.normalized_title = params['normalized_title']
        document.title = params['title']
        document.save()

    def cancel_requests(self, crid):
        document, _ = self.allegation.documents.get_or_create(type='CR')
        document.requested = False
        document.save()
