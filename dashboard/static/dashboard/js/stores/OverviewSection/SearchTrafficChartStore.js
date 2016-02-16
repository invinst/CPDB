var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var QueryListItemStore = require('./QueryListItemStore');
var PeriodPickerStore = require('./PeriodPickerStore');
var _ = require('lodash');

var _state = {
  chartData: {
    labels: [],
    datasets: [
      _.assign(AppConstants.LINE_CHART_COLOR_OPTIONS, {
        data: []
      })
    ]
  },
  options: _.extend({}, AppConstants.LINE_CHART_OPTIONS, { showTooltips: false }),
  rawData: {}
};


var SearchTrafficChartStore = assign({}, EventEmitter.prototype, {
  getState: function () {
    return _state;
  },

  updateChartData: function () {
    var activeQueryItem = QueryListItemStore.getState()['activeQueryItem'];
    var period = PeriodPickerStore.getState()['period'];
    var data = _state['rawData'];

    data = data[period][activeQueryItem];
    if (data) {
      _state.chartData.datasets[0].data = data.data;
      _state.chartData.labels = data.labels;
    }

    SearchTrafficChartStore.emitChange();
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_QUERY_ITEM:
    case AppConstants.SET_PERIOD:
      SearchTrafficChartStore.updateChartData();
      break;

    case AppConstants.RECEIVED_SEARCH_TRAFFIC_DATA:
      AppDispatcher.waitFor([QueryListItemStore.dispatch]);
      _state['rawData'] = action.data;
      SearchTrafficChartStore.updateChartData();
      break;

    default:
      break;
  }
});

module.exports = SearchTrafficChartStore;
