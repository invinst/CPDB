var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var FilterStore = require('stores/FilterStore');
var Base = require('stores/Base');


var _state = {
  data: false,
  selected: false,
  drew: false,
  hovering: false,
  zoomOut1: false
};

var SunburstStore = _.assign(Base(_state), {
  setData: function (data) {
    var root = data.sunburst;
    _state.data = root;
    _state.selected = root;
    _state.drew = false;
    SunburstStore.emitChange();
  },
  tryZoomOut: function (category, filter) {
    var selected = _state.selected;
    if (!selected.tagValue) {
      return;
    }
    if (selected.tagValue.category == category && selected.tagValue.value== filter.value) {
      _state.zoomOut1 = true;
      SunburstStore.emitChange();
    }
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SUNBURST_DATA:
      SunburstStore.setData(action.data);
      break;

    case AppConstants.REMOVED_TAG:
      SunburstStore.tryZoomOut(action.category, action.filter);
      break;

    case AppConstants.SUNBURST_SELECT_ARC:
      _state.selected = action.data;
      break;

    default:
      break;
  }
});

module.exports = SunburstStore;
