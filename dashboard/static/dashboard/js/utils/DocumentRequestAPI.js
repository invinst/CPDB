var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
var DocumentListActions = require('../actions/DocumentSection/DocumentListActions');
var TabsStore = require('../stores/DocumentSection/TabsStore');
var AddDocumentLinkModalActions = require('../actions/DocumentSection/AddDocumentLinkModalActions');


var ajax = null;

var limit = 0;
var count = 20;

var DocumentAPI = {
  get: function() {
    if (ajax) {
      ajax.abort();
    }

    var params = {
      type: TabsStore.getState().active
    };

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT, params, function(data) {
      limit = 0;
      DocumentListActions.receivedDocumentList(data.results);
    });
  },

  loadMore: function() {
    if (ajax) {
      ajax.abort();
    }
    limit += count;

    var params = {
      type: TabsStore.getState().active,
      limit: limit,
      offset: limit + count
    };

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT, params, function(data) {
      DocumentListActions.receivedMore(data.results);
    });
  },

  addLink: function(link) {
    if (ajax) {
      ajax.abort();
    }

    var params = {
      link: link
    };

    ajax = jQuery.ajax({
      url: AppConstants.DOCUMENT_LINK_END_POINT,
      data: params,
      method: 'POST',
      success: function(data) {
        AddDocumentLinkModalActions.documentLinkAdded(data.crid);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 400) {
          AddDocumentLinkModalActions.failedToAddDocumentLink();
        }
      }
    });
  }
};

module.exports = DocumentAPI;
