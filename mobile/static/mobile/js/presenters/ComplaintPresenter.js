var AppConstants = require('constants/AppConstants');

var ComplaintService = require('services/ComplaintService');
var HelperUtil = require('utils/HelperUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var ComplaintPresenter = function (complaint) {
  var complaintService = ComplaintService(complaint);

  var finalFinding = function () {
    var abbrFinalFinding = HelperUtil.fetch(complaint, 'final_finding', '').toLowerCase();
    var finalFinding = HelperUtil.fetch(AppConstants.FINAL_FINDINGS, abbrFinalFinding, 'Unknown');

    return finalFinding;
  };

  var finalStatus = function () {
    var closedStatus = 'Investigation Closed (' + finalFinding() + ')';
    return complaintService.isOpenInvestigation ? 'Open Investigation' : closedStatus;
  };

  var incidentDate = function () {
    var incidentDate = complaintService.incidentDate;
    return !!incidentDate ? incidentDate.format(AppConstants.SIMPLE_DATE_FORMAT) : '';
  };

  var startInvestigationDate = function () {
    var startInvestigationDate = complaintService.startInvestigationDate;
    return !!startInvestigationDate ? startInvestigationDate.format(AppConstants.SIMPLE_DATE_FORMAT) : '';
  };

  var endInvestigationDate = function () {
    var endInvestigationDate = complaintService.endInvestigationDate;
    return !!endInvestigationDate ? endInvestigationDate.format(AppConstants.SIMPLE_DATE_FORMAT) : '';
  };

  var beat = function () {
    var beatTypeDisplay = HelperUtil.fetch(complaint, 'beat.type_display', '');
    var beatName = HelperUtil.fetch(complaint, 'beat.name', '');

    return [beatTypeDisplay, beatName].join(' ').trim();
  };

  var address = function(){
    return [complaint.add1, complaint.add2].join(' ').trim(); // a bit magic here :>)
  };

  return {
    finalFinding: finalFinding(),
    finalStatus: finalStatus(),
    incidentDate: incidentDate(),
    startInvestigationDate: startInvestigationDate(),
    endInvestigationDate: endInvestigationDate(),
    category: HelperUtil.fetch(complaint, 'cat.category', 'Unknown'),
    allegationName: HelperUtil.fetch(complaint, 'cat.allegation_name', 'Unknown'),
    address: address(),
    city: HelperUtil.fetch(complaint, 'city', ''),
    locationType: HelperUtil.fetch(complaint, 'location', ''),
    beat: beat()
  }
};

module.exports = ComplaintPresenter;
