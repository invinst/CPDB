var AppConstants = require('../constants/AppConstants');
var WagtailPagesActions = require('actions/WagtailPagesActions');
var ajax = null;
var WagtailPagesAPI;

require('utils/jQuery');


WagtailPagesAPI = {
  getGlossaryData: function () {
    var url = AppConstants.WAGTAIL_GLOSSARY_API_ENDPOINT;

    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(url, function (data) {
      WagtailPagesActions.receivedGlossaryData(data);
    });
  }
};

module.exports = WagtailPagesAPI;
