//var AppConstants = require('constants/AppConstants');
//var moment = require('moment');
//
//var InvestigationTimelinePresenter = function (allegation, officerAllegation) {
//  var allegationPresenter = AllegationPresenter(allegation);
//  var officerAllegationPresenter = OfficerAllegationPresenter(officerAllegation);
//
//  var haveNoData = function () {
//    return !allegationPresenter.has('incidentDate') && !officerAllegationPresenter.has('startDate');
//  };
//
//  var startInvestigatingAtIncidentDate = function () {
//   //NOTE: We always have investigation date when we already have incident date but the opposite condition is not
//   //correct
//    return !officerAllegationPresenter.has('startDate') || officerAllegationPresenter.startDate()
//        .isSame(allegationPresenter.incidentDate(), 'day');
//  };
//
//  return {
//    haveNoData: haveNoData(),
//    startInvestigatingAtIncidentDate: startInvestigatingAtIncidentDate()
//  };
//};
//
//module.exports = InvestigationTimelinePresenter;
//
