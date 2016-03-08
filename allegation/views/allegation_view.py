from django.shortcuts import get_object_or_404
from django.views.generic import RedirectView

from common.models import Allegation
from share.models import Session
from url_mediator.services.session_builder import Builder, AllegationCrid, FilterTags


class AllegationView(RedirectView):
    def get_redirect_url(self, crid=None):
        allegation = get_object_or_404(Allegation, crid=crid)

        session_query = Builder(
            FilterTags(
                AllegationCrid(crids=[allegation.crid])
            )
        ).build()
        session = Session(query=session_query)
        session.save()

        return session.get_absolute_url()
