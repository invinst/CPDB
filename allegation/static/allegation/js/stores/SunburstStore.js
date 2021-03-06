var _ = require('lodash');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');

var Base = require('stores/Base');
var FilterTagStore = require('stores/FilterTagStore');

var SunburstChartD3 = require('utils/d3utils/SunburstChartD3');

var SUNBURST_DATA_CHANGE_EVENT = 'SUNBURST_DATA_CHANGE_EVENT';
var SUNBURST_SELECTED_CHANGE_EVENT = 'SUNBURST_SELECTED_CHANGE_EVENT';
var SUNBURST_ZOOMED_OUT_EVENT = 'SUNBURST_ZOOMED_OUT_EVENT';


var _state = {
  selected: false,
  data: false,
  hovering: false
};

var SunburstStore = _.assign(Base(_state), {
  setData: function (data) {
    var root = data.sunburst;
    _state.data = root;

    SunburstStore.updateSelected();
    SunburstStore.emitDataChange();
  },

  isSelected: function (category, value) {
    // this function use FilterTag values to check if sunburst arc is selected
    var selected = _state.selected;
    return selected && selected.tagValue && selected.tagValue.category == category
      && selected.tagValue.displayValue == value;
  },

  isRootSelected: function () {
    return _state.selected.name == 'Allegations';
  },

  updateSelected: function () {
    var arc;

    if (_state.selected) {
      arc = SunburstChartD3.findArc(_state.selected.name, _state.selected.category);

      if (_state.selected.fromSession) {
        if (arc) {
          _state.selected = arc;
        }
      } else {
        _state.selected = arc;
      }
    }
  },

  getSelected: function () {
    SunburstStore.updateSelected();

    if (_state.selected && _state.selected.fromSession) {
      return false;
    } else {
      return _state.selected;
    }
  },

  getSelectedParentTag: function () {
    return _state.selected.parent;
  },

  tryZoomOut: function (category, filter) {
    var tagValue;

    if (this.isSelected(category, filter.displayValue)) {
      _state.selected = _state.selected.parent;

      // Add parent arc to filter if not at root
      if (!this.isRootSelected()) {
        tagValue = _state.selected.tagValue;

        FilterTagStore.addFilter(tagValue);
        FilterTagStore.emitChange();
      }
    }
  },

  getAncestorArcs: function (arc) {
    // This also include arc
    var ancestors = [arc];
    var current = arc;

    while (current.parent) {
      ancestors.unshift(current.parent);
      current = current.parent;
    }

    return ancestors;
  },

  getArcSize: function (arc) {
    // TODO: don't calculate recursively
    var size = 0;
    var i = 0;

    if (arc.children) {
      for (i = 0; i < arc.children.length; i++) {
        size += this.getArcSize(arc.children[i]);
      }
    } else {
      size = arc.size || 0;
    }
    return size;
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
  },

  addSunburstZoomedOutListener: function (callback) {
    this.on(SUNBURST_ZOOMED_OUT_EVENT, callback);
  },

  removeSunburstZoomedOutListener: function (callback) {
    this.removeListener(SUNBURST_ZOOMED_OUT_EVENT, callback);
  },

  emitSunburstZoomedOut: function () {
    this.emit(SUNBURST_ZOOMED_OUT_EVENT);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  var selected, arcName, arcCategory, arc;

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
      SunburstStore.emitSunburstZoomedOut();
      break;

    case AppConstants.ADD_TAG:
      arc = SunburstChartD3.findArc(action.tagValue.displayValue, action.tagValue.category);
      if (arc) {
        _state.selected = arc;
      }
      SunburstStore.emitChange();
      SunburstStore.emitSelectedChange();
      SunburstStore.emitSunburstZoomedOut();
      break;

    case AppConstants.SUNBURST_SELECT_ARC:
      selected = _state['selected'];
      _state['selected'] = action.arc;
      SunburstStore.emitChange();

      // TODO: look for a better comparisons
      if (selected != action.arc) {
        SunburstStore.emitSelectedChange();
      }
      break;

    case AppConstants.SUNBURST_HOVER_ARC:
      _state['hovering'] = action.data;
      SunburstStore.emitChange();
      break;

    case AppConstants.SUNBURST_LEAVE_ARC:
      _state['hovering'] = false;
      SunburstStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      arcName = 'Allegations';
      arcCategory = '';

      if (action.data && !_.isEmpty(action.data.data.selected_sunburst_arc)) {
        arcName = action.data.data.selected_sunburst_arc.name;
        arcCategory = action.data.data.selected_sunburst_arc.category;
      }

      _state.selected = {
        name: arcName,
        category: arcCategory,
        fromSession: true
      };
      break;

    default:
      break;
  }
});

module.exports = SunburstStore;
