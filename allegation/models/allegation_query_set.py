from django.db import models


class AllegationQuerySet(models.query.QuerySet):
    def update(self, *args, **kwargs):
        if 'document_id' in kwargs and int(kwargs['document_id']) > 0:
            kwargs.setdefault('document_requested', False)
            kwargs.setdefault('document_pending', False)
        elif 'document_pending' in kwargs and \
                kwargs['document_pending'] is False:
            kwargs.setdefault('document_requested', True)
            kwargs.setdefault('document_id', 0)

        return super(AllegationQuerySet, self).update(*args, **kwargs)
