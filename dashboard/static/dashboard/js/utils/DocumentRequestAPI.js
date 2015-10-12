var _ = require('lodash');
var AppConstants = require('../constants/AppConstants');
var DocumentListActions = require('../actions/DocumentSection/DocumentListActions');
var DocumentActions = require('../actions/DocumentSection/DocumentActions');
var TabsStore = require('../stores/DocumentSection/TabsStore');
var AddDocumentLinkModalActions = require('../actions/DocumentSection/AddDocumentLinkModalActions');


var ajax = null;

var limit = 0;
var count = 20;

var DocumentRequestAPI = {
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

  loadDocument: function (id) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT + id + '/', function(data) {
      DocumentActions.receivedDocument(data);
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

  addLink: function(link, crid) {
    if (ajax) {
      ajax.abort();
    }

    var params = {
      link: link,
      crid: crid
    };

    ajax = jQuery.ajax({
      url: AppConstants.DOCUMENT_LINK_END_POINT,
      data: params,
      method: 'POST',
      success: function(data) {
        AddDocumentLinkModalActions.documentLinkAdded(data.crid);
      },
      error: function(jqXHR) {
        if (jqXHR.status == 400) {
          AddDocumentLinkModalActions.failedToAddDocumentLink();
        }
      }
    });
  },

  cancelRequest: function (allegation) {
    if (ajax) {
      ajax.abort();
    }

    var params = {
      crid: allegation.crid
    };

    ajax = jQuery.ajax({
      url: AppConstants.DOCUMENT_LINK_END_POINT,
      data: params,
      method: 'POST',
      success: function(data) {
        DocumentActions.requestCancel(allegation);
      },
      error: function(jqXHR) {
        if (jqXHR.status == 400) {
          AddDocumentLinkModalActions.failedToAddDocumentLink();
        }
      }
    });
  },

  loadByCrid: function(crid) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT, {crid: crid}, function(data) {
      if (data.results.length == 0) {
        DocumentListActions.requestNotFound();
      } else {
        DocumentListActions.setActive(data.results[0]);
      }
    });
  }
};

module.exports = DocumentRequestAPI;
