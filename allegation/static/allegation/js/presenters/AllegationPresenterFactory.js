var _ = require('lodash');

var AppConstants = require('../constants/AppConstants.js');
var complainingWitness = require('presenters/ComplainingWitnessPresenter');


var AllegationPresenterFactory = {
  buildPresenter: function (allegation) {
    var allegationComplainingWitness = function () {
      return _.map(allegation['complaining_witness'], function (item) {
        return complainingWitness(item);
      });
    };

    var displayRecFinding = function () {
      var recFindingVal = _.get(allegation, 'officer_allegation.recc_finding', 'Unknown');
      var finalFindingVal = _.get(allegation, 'officer_allegation.final_finding', 'Unknown');
      return !!recFindingVal && recFindingVal !== 'Unknown' && finalFindingVal !== recFindingVal;
    };

    var displayRecOutcome = function () {
      var recOutcomeVal = _.get(allegation, 'officer_allegation.recc_outcome', 'Unknown');
      var finalOutcomeVal = _.get(allegation, 'officer_allegation.final_outcome', 'Unknown');
      return !!recOutcomeVal && recOutcomeVal !== 'Unknown' && finalOutcomeVal !== recOutcomeVal;
    };

    var orderedDocuments = function () {
      var orderedTypes = _.keys(AppConstants.DOCUMENT_TYPE_NAMES);
      var documents = _.get(allegation, 'documents', []);
      return _.sortBy(documents, function (document) { return _.indexOf(orderedTypes, document.type); });
    };

    var documentTypes = function () {
      var documents = orderedDocuments();
      var filteredDocuments = _.filter(documents, function (document) {
        return document['documentcloud_id'] > 0;
      });
      var types = _.pluck(filteredDocuments, 'type');
      return types.join(' ');
    };

    return {
      crid: _.get(allegation, 'allegation.crid', ''),
      mainCategory: _.get(allegation, 'category.category', 'Unknown'),
      subCategory: _.get(allegation, 'category.allegation_name', ''),
      finalOutcome: _.get(allegation, 'officer_allegation.final_outcome', 'Unknown'),
      finalFinding: _.get(allegation, 'officer_allegation.final_finding', 'Unknown'),
      displayRecFinding: displayRecFinding(),
      recFinding: _.get(allegation, 'officer_allegation.recc_finding', 'Unknown'),
      displayRecOutcome: displayRecOutcome(),
      recOutcome: _.get(allegation, 'officer_allegation.recc_outcome', 'Unknown'),
      complainingWitness: allegationComplainingWitness(),
      orderedDocuments: orderedDocuments(),
      documentTypes: documentTypes()
    };
  }
};

module.exports = AllegationPresenterFactory;
