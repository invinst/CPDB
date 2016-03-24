from django.template.defaultfilters import slugify
from django.test import TestCase

from allegation.factories import (
    OfficerFactory, AllegationFactory, OfficerAllegationFactory)
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
        slugified_display_name = slugify(self.display_name)
        self.officer = OfficerFactory(officer_first=first_name, officer_last=last_name)
        self.officer_id = self.officer.id
        self.expected_url = '/officer/{name}/{id}'.format(name=slugified_display_name, id=self.officer_id)

    def test_get_url(self):
        self.officer.get_mobile_url().should.equal(self.expected_url)

    def test_suggestion_entry(self):
        expected_entry = {
            'text': self.display_name,
            'resource': 'officer',
            'resource_key': self.officer_id,
            'url': self.expected_url,
            'meta': {
                'allegations_count': self.officer.allegations_count,
                'gender': self.officer.gender,
                'race': self.officer.race,
                'star': self.officer.star
            }
        }
        self.officer.as_suggestion_entry().should.be.equal(expected_entry)


class MobileSuggestibleAllegationTest(TestCase):
    def test_get_url(self):
        crid = '1011111'
        allegation = AllegationFactory(crid=crid)
        OfficerAllegationFactory(allegation=allegation)
        expected_url = '/complaint/{crid}'.format(crid=crid)

        allegation.get_mobile_url().should.equal(expected_url)

    def test_suggestion_entry(self):
        crid = '1011111'
        allegation = AllegationFactory(crid=crid)
        OfficerAllegationFactory(allegation=allegation)
        expected_url = '/complaint/{crid}'.format(crid=crid)

        cat = allegation.officerallegation_set.first().cat

        expected_entry = {
            'text': crid,
            'resource': 'officer_allegation',
            'resource_key': crid,
            'url': expected_url,
            'meta': {
                'incident_date': allegation.incident_date,
                'cat': {
                    'allegation_name': cat.allegation_name,
                    'category': cat.category
                }
            }
        }
        allegation.as_suggestion_entry().should.be.equal(expected_entry)

    def test_suggestion_entry_without_category(self):
        crid = '1011111'
        allegation = AllegationFactory(crid=crid)
        expected_url = '/complaint/{crid}'.format(crid=crid)
        OfficerAllegationFactory(allegation=allegation, cat=None)

        expected_entry = {
            'text': crid,
            'resource': 'officer_allegation',
            'resource_key': crid,
            'url': expected_url,
            'meta': {
                'incident_date': allegation.incident_date,
                'cat': {
                    'allegation_name': '',
                    'category': ''
                }
            }
        }
        allegation.as_suggestion_entry().should.be.equal(expected_entry)
