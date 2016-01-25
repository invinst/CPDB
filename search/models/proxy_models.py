from common.models import AllegationCategory, Allegation


class AllegationCategoryProxy(AllegationCategory):
    '''Proxy model for elasticsearch index'''
    class Meta:
        proxy = True


class AllegationProxy(Allegation):
    '''Proxy model for elasticsearch index'''
    class Meta:
        proxy = True
