var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
var DocumentListActions = require('../actions/DocumentSection/DocumentListActions');


var ajax = null;

var DocumentAPI = {
  get: function() {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT, function(data) {
      DocumentListActions.receivedDocumentList(data.results);
    });
  },
};

module.exports = DocumentAPI;
