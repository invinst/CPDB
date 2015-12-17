var AppConstants = require('constants/AppConstants');
var TimelineActions = require('actions/OfficerPage/TimelineActions');

var ajax = null;

var TimelineAPI = {
  getTimelineData: function (officerId) {
    $.getJSON('/officer/timeline/', {'officer': officerId}, function (data) {
      TimelineActions.receivedData(data);
    });
  },

  getInvestigatorTimelineData: function (investigatorId) {
    $.getJSON('/investigator/timeline/', {'investigator': investigatorId}, function (data) {
      TimelineActions.receivedData(data);
    });
  }
};

module.exports = TimelineAPI;
