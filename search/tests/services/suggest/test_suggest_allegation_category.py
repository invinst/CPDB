from allegation.factories import AllegationCategoryFactory
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase
from search.services.suggest.suggest_allegation_category import SuggestAllegationCategoryCategory, SuggestAllegationCategoryCat


class SuggestAllegationCategoryTestCase(SuggestBaseTestCase):
    def test_suggest_allegation_category(self):
        allegation_category = AllegationCategoryFactory(category='Execessive Force')

        self.rebuild_index()

        SuggestAllegationCategoryCategory.query('ecess')['Category'][0]['value'].should.be.equal(allegation_category.category)
        SuggestAllegationCategoryCategory.query('not in suggest')['Category'].should.be.equal([])

    def test_suggest_allegation_category_cat(self):
        allegation_category = AllegationCategoryFactory(allegation_name='Twisted Extremities (Wrist/Arm/Leg)', cat_id='S123')

        self.rebuild_index()

        ret1 = SuggestAllegationCategoryCat.query('123')
        ret2 = SuggestAllegationCategoryCat.query('some thing wrong')

        ret1['Category ID'][0]['value'].should.be.equal(allegation_category.cat_id)
        ret1['Allegation type'][0]['value'].should.be.equal('Twisted Extremities (Wrist/Arm/Leg)')
        ret2['Category ID'].should.be.equal([])
        ret2['Allegation type'].should.be.equal([])