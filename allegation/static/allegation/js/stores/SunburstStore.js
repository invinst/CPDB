var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');

var Base = require('stores/Base');
var FilterTagStore = require('stores/FilterTagStore');
var SessionStore = require('stores/SessionStore');

var SunburstChartD3 = require('utils/d3utils/SunburstChartD3');

var SUNBURST_DATA_CHANGE_EVENT = 'SUNBURST_DATA_CHANGE_EVENT';
var SUNBURST_SELECTED_CHANGE_EVENT = 'SUNBURST_SELECTED_CHANGE_EVENT';


var _state = {
  selected: false,
  data: false,
  hovering: false
};

var SunburstStore = _.assign(Base(_state), {
  setData: function (data) {
    var root = data.sunburst;
    _state.data = root;

    SunburstStore.emitDataChange();

    if (_state.selected && _state.selected.fromSession) {
      _state.selected = SunburstChartD3.findPathByName(_state.selected.name);
    }
  },

  isSelected: function (category, value) {
    var selected = _state.selected;
    return selected && selected.tagValue && selected.tagValue.category == category && selected.tagValue.label == value
  },

  getSelected: function () {
    return _state.selected;
  },

  getSelectedParentTag: function () {
    return _state.selected.parent;
  },

  tryZoomOut: function (category, filter) {
    if (this.isSelected(category, filter.value)) {
      _state.selected = _state.selected.parent;
      var tagValue = _state.selected.tagValue;

      // Add parent arc to filter if not at root
      if (tagValue) {
        FilterTagStore.addFilter(tagValue.category, tagValue.label, tagValue.filter + '=' + tagValue.value);
        FilterTagStore.emitChange();
      }
    }
  },

  addDataChangeListener: function (callback) {
    this.on(SUNBURST_DATA_CHANGE_EVENT, callback);
  },

  removeDataChangeListener: function (callback) {
    this.removeListener(SUNBURST_DATA_CHANGE_EVENT, callback);
  },

  emitDataChange: function () {
    this.emit(SUNBURST_DATA_CHANGE_EVENT);
  },

  addSelectedChangeListener: function (callback) {
    this.on(SUNBURST_SELECTED_CHANGE_EVENT, callback);
  },

  removeSelectedChangeListener: function (callback) {
    this.removeListener(SUNBURST_SELECTED_CHANGE_EVENT, callback);
  },

  emitSelectedChange: function () {
    this.emit(SUNBURST_SELECTED_CHANGE_EVENT);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RECEIVED_SUNBURST_DATA:
      SunburstStore.setData(action.data);
      SunburstStore.emitDataChange();
      SunburstStore.emitChange();
      break;

    case AppConstants.REMOVED_TAG:
      SunburstStore.tryZoomOut(action.category, action.filter);
      SunburstStore.emitChange();
      SunburstStore.emitSelectedChange();
      break;

    case AppConstants.SUNBURST_SELECT_ARC:
      var selected  = _state['selected'];
      _state['selected'] = action.arc;
      SunburstStore.emitChange();

      // TODO: look for a better comparisons
      if (selected != action.arc) {
        SunburstStore.emitSelectedChange();
      }
      break;

    // case AppConstants.SUNBURST_HOVER_ARC:
    //   _state.hovering = action.data;
    //   SunburstStore.emitChange();
    //   break;

    // case AppConstants.SUNBURST_LEAVE_ARC:
    //   _state.hovering = false;
    //   SunburstStore.emitChange();
    //   break;

    case AppConstants.RECEIVED_SESSION_DATA:
      if (action.data && action.data.data.sunburst_arc) {
        _state.selected = {
          name: action.data.data.sunburst_arc,
          fromSession: true
        };
      }
      break;

    default:
      break;
  }
});

module.exports = SunburstStore;
