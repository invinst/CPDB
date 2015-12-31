var ComplaintService = require('services/ComplaintService');
var AppConstants = require('constants/AppConstants');
var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var SuggestionPresenter = function (suggestion) {

  var text = function () {
    return HelperUtil.fetch(suggestion, 'text', '');
  };

  var url = function () {
    return HelperUtil.fetch(suggestion, 'url', '');
  };

  var resource = function () {
    return HelperUtil.fetch(suggestion, 'resource', '');
  };

  var resourceKey = function () {
    return HelperUtil.fetch(suggestion, 'resource_key', '');
  };

  var suggestionType = function () {
    return HelperUtil.fetch(suggestion, 'suggestion_type', '');
  };

  var allegationsCount = function () {
    return HelperUtil.fetch(suggestion, 'meta.allegations_count', '0');
  };

  var officerDescription = function () {
    var gender = GenderPresenter(HelperUtil.fetch(suggestion, 'meta.gender', '')).humanReadable;
    var race = HelperUtil.fetch(suggestion, 'meta.race', 'Race unknown');
    return HelperUtil.format('{gender} {race}', {'gender': gender, 'race': race});
  };

  var incidentDate = function () {
    var complaintMeta = HelperUtil.fetch(suggestion, 'meta', '');
    var complaintService = ComplaintService(complaintMeta);
    var incidentDate = complaintService.incidentDate;
    return !!incidentDate ? incidentDate.format(AppConstants.LONG_DATE_FORMAT) : 'Unknown date';
  };

  return {
    text: text(),
    url: url(),
    resource: resource(),
    resourceKey: resourceKey(),
    suggestionType: suggestionType(),
    allegationsCount: allegationsCount(),
    officerDescription: officerDescription(),
    incidentDate: incidentDate()
  }
};

module.exports = SuggestionPresenter;
