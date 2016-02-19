var DocumentCrawlStatActions = require('actions/DocumentSection/DocumentCrawlStatActions');
var AppConstants = require('../constants/AppConstants');

var ajax = null;

var DocumentCrawlStatsAPI = {
  get: function () {
    if (ajax) {
      ajax.abort();
    }
    ajax = jQuery.getJSON(AppConstants.DOCUMENT_CRAWL_STATS_END_POINT, function (data) {
      DocumentCrawlStatActions.setCrawlStats(data);
    });
  }
};

module.exports = DocumentCrawlStatsAPI;
