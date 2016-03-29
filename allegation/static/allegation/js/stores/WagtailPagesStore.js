var _ = require('lodash');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Base = require('../stores/Base');


var _state = {
  'currentPage': null,
  'wagtailPages': []
};

var WagtailPagesStore = _.assign(Base(_state), {
  isValidPage: function (pageSlug) {
    return _.contains(_.pluck(_state.wagtailPages, 'slug'), pageSlug);
  },

  getPageBySlug: function (pageSlug) {
    return _.find(_state.wagtailPages, function (page) {
      return page.slug == pageSlug;
    });
  },

  getWagtailPages: function () {
    return _state.wagtailPages;
  },

  getCurrentPage: function () {
    return this.getPageBySlug(_state.currentPage);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.WAGTAIL_GLOSSARY_PAGE_RECEIVED_DATA:
      _state.wagtailPages = action.data.pages;
      WagtailPagesStore.emitChange();
      break;

    case AppConstants.CHANGE_WAGTAIL_PAGE:
      _state.currentPage = action.wagtailPage;
      WagtailPagesStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = WagtailPagesStore;
