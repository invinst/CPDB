var AppConstants = require('constants/AppConstants');

var ComplaintService = require('services/ComplaintService');
var HelperUtil = require('utils/HelperUtil');


var ComplaintPresenter = function (complaint) {
  var complaintService = ComplaintService(complaint);

  var finalFinding = function () {
    var abbrFinalFinding = HelperUtil.fetch(complaint, 'final_finding', '').toLowerCase();
    var finalFinding = HelperUtil.fetch(AppConstants.FINAL_FINDINGS, abbrFinalFinding, 'Unknown');

    return finalFinding;
  };

  var finalStatus = function () {
    var closedStatus = HelperUtil.format('Investigation Closed ({finalFinding})', {'finalFinding': finalFinding()});
    return complaintService.isOpenInvestigation ? 'Open Investigation' : closedStatus;
  };

  var incidentDate = function (format) {
    var incidentDate = complaintService.incidentDate;
    return incidentDate ? incidentDate.format(format) : 'Unknown date';
  };

  var startInvestigationDate = function () {
    var startInvestigationDate = complaintService.startInvestigationDate;
    return startInvestigationDate ? startInvestigationDate.format(AppConstants.SIMPLE_DATE_FORMAT) : '';
  };

  var endInvestigationDate = function () {
    var endInvestigationDate = complaintService.endInvestigationDate;
    return endInvestigationDate ? endInvestigationDate.format(AppConstants.SIMPLE_DATE_FORMAT) : '';
  };

  var address = function () {
    return [complaint.add1, complaint.add2].join(' ').trim(); // a bit magic here :>)
  };

  var documentId = function () {
    return HelperUtil.fetch(complaint, 'document_id', '');
  };

  var documentNormalizedTitle = function () {
    return HelperUtil.fetch(complaint, 'document_normalized_title', '');
  };

  var crid = function () {
    return HelperUtil.fetch(complaint, 'crid', 'Unknown');
  };

  var url = function () {
    return HelperUtil.format('/complaint/{crid}', {'crid': crid()});
  };

  return {
    crid: crid(),
    finalFinding: finalFinding(),
    finalStatus: finalStatus(),
    incidentDate: incidentDate(AppConstants.SIMPLE_DATE_FORMAT),
    startInvestigationDate: startInvestigationDate(),
    endInvestigationDate: endInvestigationDate(),
    category: HelperUtil.fetch(complaint, 'cat.category', 'Unknown'),
    allegationName: HelperUtil.fetch(complaint, 'cat.allegation_name', 'Unknown'),
    address: address(),
    city: HelperUtil.fetch(complaint, 'city', ''),
    locationType: HelperUtil.fetch(complaint, 'location', ''),
    beat: HelperUtil.fetch(complaint, 'beat.name', ''),
    documentId: documentId(),
    documentNormalizedTitle: documentNormalizedTitle(),
    getIncidentDate: incidentDate,
    url: url()
  };
};

module.exports = ComplaintPresenter;
