from allegation.factories import AreaFactory
from search.services.suggest.suggest_area import SuggestArea
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase


class SuggestAreaTestCase(SuggestBaseTestCase):
    def test_suggest_area(self):
        area = AreaFactory(name='School Ground')

        self.rebuild_index()

        SuggestArea.query('school')['allegation__areas__id'].should.be.equal([[area.name, area.id, area.type]])
        SuggestArea.query('something wrong')['allegation__areas__id'].should.be.equal([])

    def test_suggest_area_order(self):
        area1 = AreaFactory(name='same name 1', type='police-districts')
        area2 = AreaFactory(name='same name 2', type='school-grounds')
        area3 = AreaFactory(name='same name 3', type='police-beats')

        self.rebuild_index()

        SuggestArea.query('same name')['allegation__areas__id'].should.be.equal([
            [area3.name, area3.id, area3.type],
            [area1.name, area1.id, area1.type],
            [area2.name, area2.id, area2.type]
        ])
