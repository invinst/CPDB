var _ = require('lodash');
var toastr = require('toastr');

var AppConstants = require('../constants/AppConstants');

var DocumentListStore = require('stores/DocumentSection/DocumentListStore');
var DocumentListActions = require('actions/DocumentSection/DocumentListActions');
var DocumentActions = require('actions/DocumentSection/DocumentActions');
var TabsStore = require('stores/DocumentSection/TabsStore');
var AddDocumentLinkModalActions = require('actions/DocumentSection/AddDocumentLinkModalActions');
var DocumentRequestAnalysisAPI = require('utils/DocumentRequestAnalysisAPI');

var ajax = null;


var DocumentRequestAPI = {
  getSingleDocument: function (id) {
    if (ajax) {
      ajax.abort();
    }

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT + id + '/', function (data) {
      DocumentActions.receivedDocument(data);
    });
  },

  getDocuments: function () {
    var tabsState,
      params;

    if (ajax) {
      ajax.abort();
    }

    tabsState = TabsStore.getState();

    params = {
      'request_document_type': tabsState.active,
      'type': tabsState.documentType,
      'ordering': DocumentListStore.getSortOrder()
    };

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT, params, function (data) {
      DocumentListActions.receivedDocumentList(data.results, data.next);
    });
  },

  getMoreDocuments: function () {
    var nextPage;

    if (ajax) {
      ajax.abort();
    }
    nextPage = DocumentListStore.getState().next;

    if (!nextPage) {
      return;
    }

    ajax = jQuery.getJSON(nextPage, function (data) {
      DocumentListActions.receivedMore(data.results, data.next);
    });
  },

  addLink: function (link, document) {
    var params;

    if (ajax) {
      ajax.abort();
    }

    params = {
      'link': link,
      'id': _.get(document, 'id'),
      'documentType': _.get(document, 'type', TabsStore.getState().documentType)
    };

    ajax = jQuery.ajax({
      url: AppConstants.DOCUMENT_LINK_END_POINT,
      data: params,
      method: 'POST',
      success: function (data) {
        toastr.success('The document is successfully added to allegation #' + data.crid + '!');
        AddDocumentLinkModalActions.documentLinkAdded();
        DocumentRequestAnalysisAPI.get();
        DocumentRequestAPI.getDocuments();
      },
      error: function (jqXHR) {
        if (jqXHR.status == 400) {
          toastr.error('Invalid link! Please check URL');
          AddDocumentLinkModalActions.failedToAddDocumentLink();
        }
      }
    });
  },

  getSingleDocumentByCrid: function (crid, type) {
    var params;

    if (ajax) {
      ajax.abort();
    }

    params = {
      'crid': crid,
      'document_type': type
    };

    ajax = jQuery.getJSON(AppConstants.DOCUMENT_REQUEST_END_POINT, params, function (data) {
      if (data.results.length == 0) {
        DocumentListActions.requestNotFound();
      } else {
        DocumentListActions.setActive(data.results[0]);
      }
    });
  }
};

module.exports = DocumentRequestAPI;
