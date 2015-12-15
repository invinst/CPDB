var _ = require('lodash');

var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var AppConstants = require('../../../constants/AppConstants');
var Base = require('../../Base');

var _state = {
  chartData: {
    labels: [],
    datasets: [
      _.assign(AppConstants.LINE_CHART_COLOR_OPTIONS, {
      data: []
      })
    ]
  },
  options: _.extend({}, AppConstants.LINE_CHART_OPTIONS, { showTooltips: false })
};

var NewSessionPerDayChartStore = _.assign(Base(_state), {

});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_NEW_SESSIONS_DATA:
      var data = action.data['results'];
      _state['chartData']['datasets'][0]['data'] = _.pluck(data, 'count');
      _state['chartData']['labels'] = _.pluck(data, 'created_date');
      NewSessionPerDayChartStore.emitChange();
      break;

    default:
      break;
  }
});
module.exports = NewSessionPerDayChartStore;
