from django.test import SimpleTestCase
from django.utils import timezone
from freezegun import freeze_time

from common.models import Allegation
from allegation.factories import AllegationFactory
from share.factories import SessionFactory
from document.forms import RequestEmailForm


LAST_REQUEST_TIME = '2000-01-01 01:01:01'
REQUEST_TIME = timezone.now()


class RequestEmailFormTest(SimpleTestCase):
    def setUp(self):
        self.allegation = AllegationFactory(last_requested=LAST_REQUEST_TIME)
        self.session = SessionFactory()

    @freeze_time(REQUEST_TIME)
    def test_update_last_requested(self):
        email = 'email@something.com'

        form = RequestEmailForm({
            'crid': self.allegation.crid,
            'email': email,
            'session': self.session.hash_id
        })

        form.is_valid().should.be.true
        form.save()

        # reload the object
        allegation = Allegation.objects.get(pk=self.allegation.id)
        allegation.last_requested.should.equal(REQUEST_TIME)
