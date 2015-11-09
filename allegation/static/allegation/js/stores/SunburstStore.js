var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var FilterStore = require('stores/FilterStore');
var Base = require('stores/Base');

var _noControl = {
  zoomOut1: false,
  newSelected: false,
  drew: true,
  mouseLeave: false,
};

var _state = {
  selected: false,
  data: false,
  hovering: false,
  control: _.clone(_noControl),
};

var SunburstStore = _.assign(Base(_state), {
  setData: function (data) {
    var root = data.sunburst;
    _state.data = root;
    _state.selected = root;
    _state.control.drew = false;
    SunburstStore.emitChange();
  },
  tryZoomOut: function (category, filter) {
    var selected = _state.selected;
    if (!selected.tagValue) {
      return;
    }
    if (selected.tagValue.category == category && selected.tagValue.value== filter.value) {
      _state.control.zoomOut1 = true;
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
      _state.control.newSelected = true;
      SunburstStore.emitChange();
      break;

    case AppConstants.SUNBURST_HOVER_ARC:
      _state.hovering = action.data;
      SunburstStore.emitChange();
      break;

    case AppConstants.SUNBURST_LEAVE_ARC:
      _state.hovering = false;
      _state.control.mouseLeave = true;
      SunburstStore.emitChange();
      break;

    case AppConstants.SUNBURST_CLEAR_CONTROL:
      if (!_.eq(_state.control, _noControl)) {
        _state.control = _.clone(_noControl);
        SunburstStore.emitChange();
      }
      break;

    default:
      break;
  }
});

module.exports = SunburstStore;
