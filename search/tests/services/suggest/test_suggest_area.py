from allegation.factories import AreaFactory
from search.services.suggest.suggest_area import SuggestArea
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase


class SuggestAreaTestCase(SuggestBaseTestCase):
    def test_suggest_area(self):
        area = AreaFactory(name='School Ground')

        self.rebuild_index()

        SuggestArea.query('school')['Area'][0]['suggest_value'].should.be.equal('{type}: {value}'.format(
                type=area.type, value=area.name))
        SuggestArea.query('something wrong')['Area'].should.be.equal([])

    def test_suggest_area_order(self):
        area1 = AreaFactory(name='same name 1', type='police-districts')
        area2 = AreaFactory(name='same name 2', type='school-grounds')
        area3 = AreaFactory(name='same name 3', type='police-beats')

        self.rebuild_index()

        suggest_entries = SuggestArea.query('same name')['Area']

        suggest_entries[0]['suggest_value'].should.be.equal('{type}: {value}'.format(type=area3.type, value=area3.name))
        suggest_entries[1]['suggest_value'].should.be.equal('{type}: {value}'.format(type=area1.type, value=area1.name))
        suggest_entries[2]['suggest_value'].should.be.equal('{type}: {value}'.format(type=area2.type, value=area2.name))
