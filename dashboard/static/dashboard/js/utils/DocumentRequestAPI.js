var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
var DocumentListActions = require('../actions/DocumentSection/DocumentListActions');
var TabsStore = require('../stores/DocumentSection/TabsStore');


var ajax = null;

var DocumentAPI = {
  get: function() {
    if (ajax) {
      ajax.abort();
    }

    var params = {
      type: TabsStore.getState().active
    };

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT, params, function(data) {
      DocumentListActions.receivedDocumentList(data.results);
    });
  },
};

module.exports = DocumentAPI;
