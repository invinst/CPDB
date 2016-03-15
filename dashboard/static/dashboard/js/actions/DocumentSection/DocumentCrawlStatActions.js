var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');

var DocumentCrawlStatActions = {
  setCrawlStats: function (data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVED_CRAWL_STATS,
      data: data
    });
  },

  toggleCrawlStats: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TOGGLE_CRAWL_STATS
    });
  }

};

module.exports = DocumentCrawlStatActions;

