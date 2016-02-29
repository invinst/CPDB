var AppConstants = require('../constants/AppConstants');
var WagtailPagesActions = require('actions/WagtailPagesActions');
var ajax = null;
var WagtailPagesAPI;

require('utils/jQuery');


WagtailPagesAPI = {
  getData: function () {
    var url = AppConstants.WAGTAIL_PAGES_API_ENDPOINT;

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(url, function (data) {
      WagtailPagesActions.receivedData(data);
    });
  }
};

module.exports = WagtailPagesAPI;
