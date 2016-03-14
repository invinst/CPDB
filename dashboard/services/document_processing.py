class DocumentProcessing(object):
    def __init__(self, document):
        self.document = document

    def update_link(self, params):
        self.document.documentcloud_id = params['documentcloud_id']
        self.document.normalized_title = params['normalized_title']
        self.document.title = params['title']
        self.document.save()

    def cancel_requests(self):
        self.document.requested = False
        self.document.pending = False
        self.document.save()
