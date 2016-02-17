require('utils/jQuery');

var AppConstants = require('../constants/AppConstants');
var WagtailPagesActions = require('actions/WagtailPagesActions');

var ajax = null;

var WagtailPagesAPI = {
  getData: function () {
    if (ajax) {
      ajax.abort();
    }

    var url = AppConstants.WAGTAIL_PAGES_API_ENDPOINT;

    ajax = jQuery.getJSON(url, function (data) {
      WagtailPagesActions.receivedData(data);
    });
  }
};

module.exports = WagtailPagesAPI;
