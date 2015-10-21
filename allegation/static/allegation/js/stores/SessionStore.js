var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('stores/Base');
var FilterStore = require('../stores/FilterStore');
var MapStore = require('../stores/MapStore');
var OfficerListStore = require('../stores/OfficerListStore');
var OfficerPresenter = require('presenters/OfficerPresenter');

var _state = {
  'data': {
    'new': true,
    'title': '',
    'hash': '',
    'query': {},
    'readable_query': {}
  },
  'siteTitle': AppConstants.DEFAULT_SITE_TITLE
};

var SessionStore = _.assign(Base(_state), {
  updateSession: function(data) {
    _state['data'] =_.assign(_state['data'], data);
    this.emitChange();
  },

  getHash: function() {
    return _state['data']['hash'];
  },

  addTag: function (category, filter) {
    var filterObject = {
      'text': filter.label,
      'value': filter.value
    }

    var tags = _state.data.readable_query[category]
    if (tags) {
      tags.push(filterObject);
    } else {
      _state.data.readable_query[category] = [filterObject];
    }
  },

  removeTag: function (category, filter) {
    var tags = _state.data.readable_query[category]
    if (tags) {
      for (i in tags) {
        if (tags[i].value == filter.value) {
          tags.splice(i, 1);
          break;
        }
      }
    }
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.SAVE_SESSION:
    // SessionStore.updateSession(action.data);
    SessionStore.emitChange();
      break;

  case AppConstants.RECEIVED_SESSION_DATA:
    var data = action.data.data;
    data['title'] = data['title'] || AppConstants.DEFAULT_SITE_TITLE;
    _state['data'] = data;
    _state.siteTitle = data.title;
    SessionStore.emitChange();
    break;

    case AppConstants.UPDATE_TITLE:
      var title = action.title;
      _state['data']['title'] = title;
      _state.siteTitle = title;
      SessionStore.emitChange();
      break;

    case AppConstants.RECEIVED_OFFICER_DATA:
      _state.siteTitle = OfficerPresenter(action.data.officer).displayName.capitalize();
      SessionStore.emitChange();
      break;

    case AppConstants.RECEIVED_UPDATED_SESSION_DATA:
      _state['data'] = action.data.data;
      _state.siteTitle = _state['data'].title;
      SessionStore.emitChange();
      break;

    case AppConstants.ADD_TAG:
      SessionStore.addTag(action.category, action.filter);
      SessionStore.emitChange();
      break;

    case AppConstants.REMOVE_TAG:
      SessionStore.removeTag(action.category, action.filter);
      SessionStore.emitChange();
      break;

    default: break;
  }
});

module.exports = SessionStore;
