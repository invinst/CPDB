var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var ComplainingWitnessPresenter = function (complainingWitness) {
  var description = function () {
    var age = HelperUtil.fetch(complainingWitness, 'age', 'Uknown');
    var ageDisplay = 'Age ' + age;
    var gender = GenderPresenter(complainingWitness['gender']).humanReadable;
    var race = HelperUtil.fetch(complainingWitness, 'race', '');

    return [gender, race, ageDisplay].join(', ');
  };

  return {
    description: description()
  };
};

module.exports = ComplainingWitnessPresenter;
