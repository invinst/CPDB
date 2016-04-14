var ComplainingWitnessPresenter, f;

require('should');

f = require('utils/tests/f');

ComplainingWitnessPresenter = require('presenters/ComplainingWitnessPresenter');

describe('ComplainingWitnessPresenter', function () {
  describe('#description', function () {
    it('should brief information about witness\'s gender, race, age', function () {
      var complainingWitness = f.create('ComplainingWitness', {'gender': 'M', 'race': 'Black', 'age': 40});
      var expectedDescription = 'Male, Black, Age 40';
      var presenter = ComplainingWitnessPresenter(complainingWitness);

      presenter.description.should.be.equal(expectedDescription);
    });

    it('should return `Gender unknown` if there is no gender', function () {
      var complainingWitness = f.create('ComplainingWitness', {'gender': ''});
      var presenter = ComplainingWitnessPresenter(complainingWitness);

      presenter.description.should.containEql('Gender unknown');
    });

    it('should return `Age unknown` if there is no age', function () {
      var complainingWitness = f.create('ComplainingWitness', {'age': ''});
      var presenter = ComplainingWitnessPresenter(complainingWitness);

      presenter.description.should.containEql('Age unknown');
    });

    it('should return `Race unknown` if there is no race', function () {
      var complainingWitness = f.create('ComplainingWitness', {'race': ''});
      var presenter = ComplainingWitnessPresenter(complainingWitness);

      presenter.description.should.containEql('Race unknown');
    });
  });
});
