var _ = require('lodash');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var DocumentCrawlStatAPI = require('utils/DocumentCrawlStatAPI');
var Base = require('../Base');

var _state = {
  crawlStats: false,
  showCrawlStats: false
};

var DocumentCrawlStatStore = _.assign(Base(_state), {

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
