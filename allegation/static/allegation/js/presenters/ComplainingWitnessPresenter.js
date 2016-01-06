var _ = require('lodash');

var gender = require('presenters/GenderPresenter');


var ComplainingWitnessPresenter = function (complainingWitness) {
  var age = complainingWitness.age ? 'Age ' + complainingWitness.age : '';
  var genderReadable = gender(complainingWitness.gender)
  var race = complainingWitness.race || '';

  return _([race, genderReadable, age]).compact().join(', ')
}

module.exports = ComplainingWitnessPresenter;
