var TimelineActions = require('actions/OfficerPage/TimelineActions');


var TimelineAPI = {
  getTimelineData: function (officerId) {
    $.getJSON('/officer/timeline/', {'officer': officerId}, function (data) {
      TimelineActions.receivedData(data);
    });
  }
};

module.exports = TimelineAPI;
