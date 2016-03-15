var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppConstants = require('../../constants/AppConstants');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var PeriodPickerStore = require('./PeriodPickerStore');
var _ = require('lodash');


var _state = {
  queries: [],
  activeQueryItem: '',
  rawData: {}
};


var QueryListItemStore = assign({}, EventEmitter.prototype, {
  getState: function () {
    return _state;
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  setRawData: function (data) {
    var rawData = {};
    var period;

    for (period in data) {
      rawData[period] = Object.keys(data[period]);
    }

    _state['rawData'] = rawData;
  },

  updateQueriesData: function () {
    var period = PeriodPickerStore.getState().period;
    var queries = _state['rawData'][period];

    _state['queries'] = queries;
    _state['activeQueryItem'] = _.first(queries);

    QueryListItemStore.emitChange();
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});


QueryListItemStore.dispatch = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SET_ACTIVE_QUERY_ITEM:
      _state['activeQueryItem'] = action.activeQueryItem;
      QueryListItemStore.emitChange();
      break;

    case AppConstants.RECEIVED_SEARCH_TRAFFIC_DATA:
      AppDispatcher.waitFor([PeriodPickerStore.dispatch]);
      QueryListItemStore.setRawData(action.data);
      QueryListItemStore.updateQueriesData();

      break;

    case AppConstants.SET_PERIOD:
      AppDispatcher.waitFor([PeriodPickerStore.dispatch]);
      QueryListItemStore.updateQueriesData();
      break;

    default:
      break;
  }
});

module.exports = QueryListItemStore;
