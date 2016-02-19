var React = require('react');
var classnames = require('classnames');
var bootbox = require('bootbox');
var AppConstants = require('../../constants/AppConstants');
var AddDocumentLinkModalActions = require('../../actions/DocumentSection/AddDocumentLinkModalActions');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var DocumentRequestStatusAPI = require('../../utils/DocumentRequestStatusAPI');

var DocumentMixin = {
  getStatus: function (allegation) {
    if (allegation.document_id) {
      return 'fulfilled';
    }

    if (allegation.document_requested) {
      if (allegation.document_pending) {
        return 'pending';
      }

      return 'requesting';
    }

    return 'missing';
  },

  getStatusObject: function (status) {
    return AppConstants.DOCUMENT_STATUS[status];
  },

  rowClassName: function (allegation) {
    return classnames('document pointer', {
      requested: allegation.document_requested,
      fulfilled: allegation.document_id
    });
  },

  showAddLinkModal: function (crid, e) {
    e.preventDefault();
    e.stopPropagation();
    AddDocumentLinkModalActions.show(crid);
  },

  putToPending: function (allegation, e) {
    e.preventDefault();
    e.stopPropagation();
    DocumentRequestStatusAPI.putTo(allegation, 'pending');
  },

  cancelPending: function (allegation, e) {
    e.preventDefault();
    e.stopPropagation();
    DocumentRequestStatusAPI.putTo(allegation, 'requesting');
  },

  onCancelClick: function (allegation, e) {
    e.preventDefault();
    e.stopPropagation();
    bootbox.confirm('Do you want to cancel document request for #' + allegation.crid, function (yes) {
      if (yes) {
        DocumentRequestAPI.cancelRequest(allegation);
      }
    });
  },

  renderDocumentActions: function (status, allegation) {
    switch (status) {
      case 'requesting':
        return (
          <div>
            <button className='btn btn-primary' onClick={ this.showAddLinkModal.bind(this, allegation.crid) }>
              <i className='fa fa-link'></i> Add
            </button>
            <button className='btn btn-primary' onClick={ this.putToPending.bind(this, allegation) }>
              Request
            </button>
            <button className='btn btn-cancel' onClick={ this.onCancelClick.bind(this, allegation) }>
              <i className='fa fa-times'></i> Cancel
            </button>
          </div>
        );
      case 'pending':
        return (
          <div>
            <button className='btn btn-primary' onClick={ this.showAddLinkModal.bind(this, allegation.crid) }>
              <i className='fa fa-link'></i> Add
            </button>
            <button className='btn btn-primary' onClick={ this.cancelPending.bind(this, allegation) }>
              Cancel Pending
            </button>
            <button className='btn btn-cancel' onClick={ this.onCancelClick.bind(this, allegation) }>
              <i className='fa fa-times'></i> Cancel
            </button>
          </div>
        );
      case 'fulfilled':
        return (
          <div>
            <button className='btn btn-primary inverse' onClick={ this.showAddLinkModal.bind(this, allegation.crid) }>
              <i className='fa fa-refresh'></i> Update
            </button>
          </div>
        );
      case 'missing':
        return (
          <div>
            <button className='btn btn-primary' onClick={ this.showAddLinkModal.bind(this, allegation.crid) }>
              <i className='fa fa-link'></i> Add
            </button>
          </div>
        );
      default:
        return (
          <div>
            <button className='btn btn-primary' onClick={ this.showAddLinkModal.bind(this, allegation.crid) }>
              <i className='fa fa-link'></i> Add
            </button>
            <button className='btn btn-cancel' onClick={ this.onCancelClick.bind(this, allegation) }>
              <i className='fa fa-times'></i> Cancel
            </button>
          </div>
        );
    }
  }

};

module.exports = DocumentMixin;
