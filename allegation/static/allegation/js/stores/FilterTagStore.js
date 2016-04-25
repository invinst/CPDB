var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('stores/Base');

var ENABLE_EVENT = 'ENABLE_EVENT';
var DISABLE_EVENT = 'DISABLE_EVENT';


var _state = {
  initialized: false,
  filters: {},
  stacking: false
};

var isNotPinned = function (item) {
  return !item.pinned;
};

var matchValue = function (value) {
  return function (item) {
    return item.value == value;
  };
};


var FilterTagStore = _.assign(Base(_state), {
  isNoFilter: function () {
    return _.isEmpty(_state.filters);
  },

  isStacking: function () {
    return _state.stacking;
  },

  update: function (category, values) {
    _state['filters'][category] = _.union([], _state['filters'][category], values);
  },

  isInFilter: function (category, value) {
    return _.contains(_.pluck(_state['filters'][category], 'value'), value);
  },

  addFilter: function (tagValue) {
    this.removeFiltersInCategory(tagValue.category);

    _state['filters'][tagValue.category] = _state['filters'][tagValue.category] || [];

    _state['filters'][tagValue.category].push({
      value: tagValue.value,
      category: tagValue.category,
      displayValue: tagValue.displayValue,
      displayCategory: tagValue.displayCategory,
      pinned: _state.stacking
    });
  },

  removeFiltersInCategory: function (category) {
    _.remove(_state['filters'][category], isNotPinned);
    this.removeCategory(category);
  },

  removeFilter: function (category, value) {
    if (_state['filters'][category]) {
      _.remove(_state['filters'][category], matchValue(value));

      this.removeCategory(category);
    }
  },

  removeCategory: function (category) {
    if (_state['filters'][category] && _state['filters'][category].length == 0) {
      delete _state['filters'][category];
    }
  },

  getFilter: function (category, value) {
    return _.find(_state['filters'][category], matchValue(value));
  },

  pinFilter: function (category, value) {
    var filter = this.getFilter(category, value);
    if (filter) {
      filter.pinned = !filter.pinned;
    }
  },

  isPinned: function (category, value) {
    return _.get(this.getFilter(category, value), 'pinned');
  },

  toggleFilter: function (tagValue) {
    if (this.getFilter(tagValue.category, tagValue.value)) {
      this.removeFilter(tagValue.category, tagValue.value);
    } else {
      this.addFilter(tagValue);
      this.pinFilter(tagValue.category, tagValue.value);
    }
  },

  isAllTagsPinned: function () {
    var allTagsPinned = true;
    _.forOwn(_state['filters'], function (list, category) {
      var pinnedTags = _.reduce(list, function (sum, obj) {
        return sum + (obj.pinned ? 1 : 0);
      }, 0);
      if (list.length != pinnedTags) {
        allTagsPinned = false;
        return false;
      }
    });
    return allTagsPinned;
  },

  toggleAllTags: function () {
    var allTagsPinned = this.isAllTagsPinned();
    var self = this;

    _.forOwn(_state['filters'], function (list, category) {
      _.each(list, function (obj) {
        if (allTagsPinned || !self.isPinned(category, obj.value)) {
          self.pinFilter(category, obj.value);
        }
      });
    });
  },

  generateTagValue: function (category, value, displayCategory, displayValue) {
    return {
      category: category,
      value: value,
      displayCategory: displayCategory,
      displayValue: displayValue
    };
  },

  getAll: function (category) {
    if (category) {
      return _.get(_state['filters'], category, []);
    }

    return _state['filters'];
  },

  // Old interface
  isInitialized: function () {
    return _state['initialized'];
  },

  setInitialized: function (val) {
    _state['initialized'] = val;
  },

  getSession: function () {
    return {
      filters: _state['filters'],
      stacking: _state['stacking']
    };
  },

  setSession: function (session) {
    _state['filters'] = session.filters || {};
    _state['stacking'] = session.stacking || false;
  },

  getFilters: function () {
    return _state['filters'];
  },

  addDisableListener: function (callback) {
    this.on(DISABLE_EVENT, callback);
  },

  removeDisableListener: function (callback) {
    this.removeListener(DISABLE_EVENT, callback);
  },

  emitDisable: function () {
    this.emit(DISABLE_EVENT);
  },

  addEnableListener: function (callback) {
    this.on(ENABLE_EVENT, callback);
  },

  removeEnableListener: function (callback) {
    this.removeListener(ENABLE_EVENT, callback);
  },

  emitEnable: function () {
    this.emit(ENABLE_EVENT);
  }
});


FilterTagStore.dispatcherToken = AppDispatcher.register(function (action) {
  var sessionQuery,
    arc,
    selected,
    isArcParentSelected,
    current;

  switch (action.actionType) {
    case AppConstants.ENTER_EMBED_MODE:
      _state['initialized'] = false;
      FilterTagStore.emitDisable();
      break;

    case AppConstants.LEAVE_EMBED_MODE:
      _state['initialized'] = false;
      FilterTagStore.emitEnable();
      break;

    case AppConstants.ADD_TAG:
      FilterTagStore.addFilter(action.tagValue);
      FilterTagStore.emitChange();
      break;

    case AppConstants.TOGGLE_TAGS:
      // var values = _(action.filters).chain().pluck('value');
      // We do a trick here, first we add it in, then we pin it
      // When adding completely, we pin one more time to `unpin` it
      // This will help us for not adding a new exception to API
      _.each(action.tags, function (tag) {
        FilterTagStore.toggleFilter(tag);
      });

      _.each(action.tags, function (tag) {
        FilterTagStore.pinFilter(tag.category, tag.value);
      });

      FilterTagStore.emitChange();
      break;

    case AppConstants.REMOVE_TAG:
      FilterTagStore.removeFilter(action.category, action.value);
      FilterTagStore.emitChange();
      break;

    case AppConstants.REMOVE_CATEGORY:
      FilterTagStore.removeFiltersInCategory(action.category);
      FilterTagStore.emitChange();
      break;

    case AppConstants.PIN_TAG:
      FilterTagStore.pinFilter(action.category, action.value);
      FilterTagStore.emitChange();
      break;

    case AppConstants.TOGGLE_ALL_TAGS:
      FilterTagStore.toggleAllTags();
      FilterTagStore.emitChange();
      break;

    case AppConstants.TOGGLE_STACKING_MODE:
      _state.stacking = !_state.stacking;
      _.each(
        _.flatten(_.values(_state.filters)),
        function (filter) {
          filter.pinned = _state.stacking;
        }
      );
      FilterTagStore.emitChange();
      break;

    case AppConstants.RECEIVED_SESSION_DATA:
      sessionQuery = _.get(action.data, 'data.query', {});
      FilterTagStore.setSession(sessionQuery);
      _state['initialized'] = sessionQuery['filters'] || {};
      FilterTagStore.emitChange();
      break;

    case AppConstants.SUNBURST_SELECT_ARC:
      arc = action.arc;
      selected = action.selected;

      isArcParentSelected = false;
      current = selected;
      while (current.parent) {
        isArcParentSelected = isArcParentSelected || (arc == current.parent);
        current = current.parent;
      }

      if (selected && isArcParentSelected && selected.tagValue) {
        current = selected;
        while (current != arc) {
          FilterTagStore.removeFilter(
            current.tagValue.category, current.tagValue.value);
          current = current.parent;
        }
      }

      if (arc.tagValue) {
        if (arc.tagValue.removeParent) {
          FilterTagStore.removeFilter(
              arc.parent.tagValue.category, arc.parent.tagValue.value);
        }
        FilterTagStore.addFilter(arc.tagValue);
      }
      FilterTagStore.emitChange();
      break;

    default:
      break;
  }
});


module.exports = FilterTagStore;
