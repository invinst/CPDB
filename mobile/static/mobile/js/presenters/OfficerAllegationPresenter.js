var AppConstants = require('constants/AppConstants');

var S = require('string');

var DateUtil = require('utils/DateUtil');
var HashUtil = require('utils/HashUtil');
var u = require('utils/HelperUtil');


var OfficerAllegationPresenter = function (officerAllegation) {
  var finalFinding = function () {
    var abbrFinalFinding = u.fetch(officerAllegation, 'final_finding', '').toLowerCase();
    var finalFinding = u.fetch(AppConstants.FINAL_FINDINGS, abbrFinalFinding, 'Unknown');

    return finalFinding;
  };

  var finalStatus = function () {
    var closedStatus = u.format('Investigation Closed ({finalFinding})', {'finalFinding': finalFinding()});
    return isOpenInvestigation() ? 'Open Investigation' : closedStatus;
  };

  var startDate = function () {
    return DateUtil.sanitizeDate(u.fetch(officerAllegation, 'start_date', ''));
  };

  var endDate = function () {
    return DateUtil.sanitizeDate(u.fetch(officerAllegation, 'end_date', ''));
  };

  var startDateDisplay = function () {
    var start = startDate();
    return start ? start.format(AppConstants.SIMPLE_DATE_FORMAT) : '';
  };

  var endDateDisplay = function () {
    var end = endDate();
    return end ? end.format(AppConstants.SIMPLE_DATE_FORMAT) : '';
  };

  var isOpenInvestigation = function () {
    return u.fetch(officerAllegation, 'final_outcome_class', '') == 'open-investigation';
  };

  var startInvestigatingAt = function (incidentDate) {
    var start = startDate();

    return start && start.isSame(incidentDate, 'day');
  };

  var haveEnoughDataForTimeline = function (incidentDate) {
    return !!(startDate() || incidentDate);
  };

  var allegationNameForUrl = function () {
    return u.fetch(officerAllegation, 'cat.allegation_name', 'No category');
  };

  var url = function (crid) {
    return u.format('/complaint/{crid}/{slugifiedCategory}/{categoryHashId}', {
      'crid': crid,
      'slugifiedCategory': S(allegationNameForUrl()).slugify().s,
      'categoryHashId': HashUtil.encode(u.fetch(officerAllegation, 'cat.id', 0))
    });
  };

  return {
    allegationName: u.fetch(officerAllegation, 'cat.allegation_name', ''),
    category: u.fetch(officerAllegation, 'cat.category', 'Unknown'),
    endDateDisplay: endDateDisplay(),
    finalFinding: finalFinding(),
    finalStatus: finalStatus(),
    haveEnoughDataForTimeline: haveEnoughDataForTimeline,
    isOpenInvestigation: isOpenInvestigation(),
    startDateDisplay: startDateDisplay(),
    startInvestigatingAt: startInvestigatingAt,
    url: url
  };
};

module.exports = OfficerAllegationPresenter;

