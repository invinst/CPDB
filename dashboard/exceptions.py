

class InvalidDocumentError(Exception):
    def __init__(self, message='Invalid document link'):
        self.message = message

    def __str__(self):
        return repr(self.message)
