var moment = require('moment');

var AppConstants = require('constants/AppConstants');

var HelperUtil = require('utils/HelperUtil');


var ComplaintService = function (complaint) {
  var incidentDate = function () {
    var incidentDate = moment(HelperUtil.fetch(complaint, 'incident_date', ''));
    if (incidentDate.isBefore(moment(AppConstants.FIRST_AVAILABLE_DATE)) || !incidentDate.isValid()) {
      return false;
    }
    return incidentDate;
  };

  var startInvestigationDate = function () {
    var startDate = moment(HelperUtil.fetch(complaint, 'start_date', ''));
    return startDate.isValid() ? startDate : false;
  };

  var endInvestigationDate = function () {
    var endDate = moment(HelperUtil.fetch(complaint, 'end_date', ''));
    return endDate.isValid() ? endDate : false;
  };

  var haveNoData = function () {
    return !incidentDate() & !startInvestigationDate();
  };

  var isOpenInvestigation = function () {
    return HelperUtil.fetch(complaint, 'final_outcome_class', '') == 'open-investigation';
  };

  var startInvestigatingAtIncidentDate = function () {
    // NOTE: We always have investigation date when we already have incident date but the opposite condition is not
    // correct
    return !startInvestigationDate() || startInvestigationDate().isSame(incidentDate(), 'day')
  };

  var hasLocation = function(){
    return complaint.beat || complaint.location || complaint.add1 || complaint.add2 || complaint.city || complaint.point;
  };

  var hasFullAddress = function(){
    return complaint.add1 && complaint.add2;
  };

  var hasNoData = function() {
    return !complaint.locationType && !hasLocation();
  };

  return {
    isOpenInvestigation: isOpenInvestigation(),
    startInvestigatingAtIncidentDate: startInvestigatingAtIncidentDate(),
    incidentDate: incidentDate(),
    startInvestigationDate: startInvestigationDate(),
    endInvestigationDate: endInvestigationDate(),
    haveNoData: haveNoData(),
    hasLocation: hasLocation(),
    hasFullAddress: hasFullAddress(),
    hasNoData: hasNoData()
  }
};

module.exports = ComplaintService;
