from django.core.mail import send_mail
from unittest.case import skip

from common.tests.core import SimpleTestCase


class LiveServerIntegrityTestCase(SimpleTestCase):
    skip_msg = 'Only need to run after production deploy, with live data'

    @skip(skip_msg)
    def test_email(self):
        return_code = send_mail('Production test email', 'Yo', None, ['giang.nguyen@eastagile.com'], fail_silently=True)
        return_code.should.equal(1)
