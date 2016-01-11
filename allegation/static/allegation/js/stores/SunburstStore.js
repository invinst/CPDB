var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var FilterTagStore = require('stores/FilterTagStore');
var SessionStore = require('stores/SessionStore');
var Base = require('stores/Base');

var DATA_CHANGE_EVENT = 'data-change';
var SELECTED_CHANGE_EVENT = 'selected-change';


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
  },

  isSelected: function (category, value) {
    var selected = _state.selected;
    return selected && selected.tagValue && selected.tagValue.category == category && selected.tagValue.value== value
  },

  getSelectedParentTag: function () {
    return _state.selected.parent;
  },

  tryZoomOut: function (category, filter) {
    if (this.isSelected(category, filter.value)) {
      var parent = _state.selected = _state.selected.parent;
      var tagValue = parent.tagValue;

      if (tagValue) {
        FilterTagStore.addFilter(tagValue.category, tagValue.label, tagValue.filter + '=' + tagValue.value);
        FilterTagStore.emitChange();

        SessionStore.addTag(tagValue.category, tagValue);
        SessionStore.emitChange();
      }

      SunburstStore.emitChange();
    }
  },

  addDataChangeListener: function(callback) {
    this.on(DATA_CHANGE_EVENT, callback);
  },

  removeDataChangeListener: function(callback) {
    this.removeListener(DATA_CHANGE_EVENT, callback);
  },

  emitDataChange: function() {
    this.emit(DATA_CHANGE_EVENT);
  },

  addSelectedChangeListener: function(callback) {
    this.on(SELECTED_CHANGE_EVENT, callback);
  },

  removeSelectedChangeListener: function(callback) {
    this.removeListener(SELECTED_CHANGE_EVENT, callback);
  },

  emitSelectedChange: function() {
    this.emit(SELECTED_CHANGE_EVENT);
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
      selected  = _state.selected
      _state.selected = action.data;
      SunburstStore.emitChange();

      if (selected != _state.selected) {
        SunburstStore.emitSelectedChange();
      }
      break;

    case AppConstants.SUNBURST_HOVER_ARC:
      _state.hovering = action.data;
      SunburstStore.emitChange();
      break;

    case AppConstants.SUNBURST_LEAVE_ARC:
      _state.hovering = false;
      SunburstStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      if (action.data && action.data.data.sunburst_arc) {
        _state.selected = {name: action.data.data.sunburst_arc};
        SunburstStore.emitChange();
      }
      break;

    default:
      break;
  }
});

module.exports = SunburstStore;
