from django.shortcuts import get_object_or_404
from django.views.generic import RedirectView

from common.models import Allegation, AllegationCategory
from common.utils.mobile_url_hash_util import MobileUrlHashUtil
from share.models import Session
from url_mediator.services.session_builder import Builder, AllegationCrid, FilterTags, AllegationType


class AllegationView(RedirectView):
    def get_redirect_url(self, crid=None, category_slug=None, cat_hash=None):
        allegation = get_object_or_404(Allegation, crid=crid)
        cat_id = MobileUrlHashUtil().decode(cat_hash)
        category = get_object_or_404(AllegationCategory, pk=cat_id)

        session_query = Builder(
            FilterTags(
                AllegationCrid(crids=[allegation.crid]),
                AllegationType(categories=[(category.id, category.category)])
            )
        ).build()
        session = Session(query=session_query)
        session.save()

        return session.get_absolute_url()
