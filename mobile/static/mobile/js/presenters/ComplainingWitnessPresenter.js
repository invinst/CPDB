var GenderPresenter = require('presenters/GenderPresenter');

var ComplainingWitnessPresenter = function (complainingWitness) {
  var description = function () {
    var age = 'Age ' + complainingWitness['age'];
    var gender = GenderPresenter(complainingWitness['gender']).humanReadable;

    return [gender, complainingWitness['race'], age].join(', ');
  };

  return {
    description: description()
  };
};

module.exports = ComplainingWitnessPresenter;
