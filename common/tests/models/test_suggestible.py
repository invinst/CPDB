from django.core.urlresolvers import reverse
from django.test import TestCase

from allegation.factories import OfficerFactory, AllegationFactory
from common.models.suggestible import MobileSuggestible


class MobileSuggestibleTest(TestCase):
    def setUp(self):
        self.suggestible = MobileSuggestible()

    def test_get_url(self):
        self.suggestible.get_mobile_url.when.called.should.throw(NotImplementedError)

    def test_suggestion_entry(self):
        self.suggestible.as_suggestion_entry.when.called.should.throw(NotImplementedError)


class MobileSuggestibleOfficerTest(TestCase):
    def setUp(self):
        first_name = 'First'
        last_name = 'Last'
        self.display_name = '{first_name} {last_name}'.format(first_name=first_name, last_name=last_name)
        self.officer = OfficerFactory(officer_first=first_name, officer_last=last_name)
        self.officer_id = self.officer.id
        self.expected_url = '{base_url}officer/{name}/{id}'.format(base_url=reverse('mobile:home'),
                                                                   name=self.display_name, id=self.officer_id)

    def test_get_url(self):
        self.officer.get_mobile_url().should.equal(self.expected_url)

    def test_suggestion_entry(self):
        expected_entry = {
            'text': self.display_name,
            'resource': 'officer',
            'resource_key': self.officer_id,
            'url': self.expected_url
        }
        self.officer.as_suggestion_entry().should.be.equal(expected_entry)


class MobileSuggestibleAllegationTest(TestCase):
    def setUp(self):
        self.crid = '1011111'
        self.allegation = AllegationFactory(crid=self.crid)
        self.expected_url = '{base_url}complaint/{crid}'.format(base_url=reverse('mobile:home'), crid=self.crid)

    def test_get_url(self):
        self.allegation.get_mobile_url().should.equal(self.expected_url)

    def test_suggestion_entry(self):
        expected_entry = {
            'text': self.crid,
            'resource': 'allegation',
            'resource_key': self.crid,
            'url': self.expected_url
        }
        self.allegation.as_suggestion_entry().should.be.equal(expected_entry)
