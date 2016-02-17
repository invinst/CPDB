var _ = require('lodash');

var complainingWitness = require('presenters/ComplainingWitnessPresenter');


var AllegationPresenter = function (allegation) {
  var allegationComplainingWitness = function () {
    return _.map(allegation['complaining_witness'], function (item) {
      return complainingWitness(item);
    });
  };
  return {
    crid: _.get(allegation, 'allegation.crid', ''),
    mainCategory: _.get(allegation, 'category.category', 'Unknown'),
    subCategory: _.get(allegation, 'category.allegation_name', ''),
    finalOutcome: _.get(allegation, 'officer_allegation.final_outcome', 'Unknown'),
    finalFinding: _.get(allegation, 'officer_allegation.final_finding', 'Unknown'),
    complainingWitness: allegationComplainingWitness()
  };
};

module.exports = AllegationPresenter;
