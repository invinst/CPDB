var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var DocumentCrawlStatAPI = require('utils/DocumentCrawlStatAPI');

var _state = {};

var DocumentCrawlStatStore = _.assign({}, EventEmitter.prototype, {
  getState: function () {
    return _state;
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
    case AppConstants.RECEIVED_CRAWL_STATS:
      _state.crawlStats = action.data;
      DocumentCrawlStatStore.emitChange();
      break;


    case AppConstants.GET_CRAWL_STATS:
      DocumentCrawlStatAPI.get();
      break;

    case AppConstants.TOGGLE_CRAWL_STATS:
      _state['showCrawlStats'] = !_state['showCrawlStats'];
      DocumentCrawlStatStore.emitChange();
      break;
  }
});

module.exports = DocumentCrawlStatStore;
