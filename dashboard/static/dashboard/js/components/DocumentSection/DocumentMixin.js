var React = require('react');
var bootbox = require('bootbox');

var AddDocumentLinkModalActions = require('actions/DocumentSection/AddDocumentLinkModalActions');
var DocumentRequestStatusAPI = require('utils/DocumentRequestStatusAPI');


var DocumentMixin = {
  showAddLinkModal: function (presenter, e) {
    e.preventDefault();
    e.stopPropagation();
    AddDocumentLinkModalActions.show(presenter.rawDocument);
  },

  putToPending: function (presenter, e) {
    e.preventDefault();
    e.stopPropagation();
    DocumentRequestStatusAPI.putStatus(presenter.rawDocument, 'pending');
  },

  cancelPending: function (presenter, e) {
    e.preventDefault();
    e.stopPropagation();
    DocumentRequestStatusAPI.putStatus(presenter.rawDocument, 'requesting');
  },

  onCancelClick: function (presenter, e) {
    e.preventDefault();
    e.stopPropagation();
    bootbox.confirm('Do you want to cancel document request for #' + presenter.crid, function (yes) {
      if (yes) {
        DocumentRequestStatusAPI.putStatus(presenter.rawDocument, 'missing');
      }
    });
  },

  renderAddLinkButton: function (presenter) {
    return (
      <button className='btn btn-primary' onClick={ this.showAddLinkModal.bind(this, presenter) }>
        <i className='fa fa-link'></i> Add
      </button>
    );
  },

  renderRequestButton: function (presenter) {
    return (
      <button className='btn btn-primary' onClick={ this.putToPending.bind(this, presenter) }>
        Request
      </button>
    );
  },

  renderCancelPendingButton: function (presenter) {
    return (
      <button className='btn btn-primary' onClick={ this.cancelPending.bind(this, presenter) }>
        Cancel Pending
      </button>
    );
  },

  renderCancelButton: function (presenter) {
    return (
      <button className='btn btn-cancel' onClick={ this.onCancelClick.bind(this, presenter) }>
        <i className='fa fa-times'></i> Cancel
      </button>
    );
  },

  renderUpdateButton: function (presenter) {
    return (
      <button className='btn btn-primary inverse' onClick={ this.showAddLinkModal.bind(this, presenter) }>
        <i className='fa fa-refresh'></i> Update
      </button>
    );
  },

  renderDocumentActions: function (presenter) {
    switch (presenter.documentStatus) {
      case 'requesting':
        return (
          <div>
            { this.renderAddLinkButton(presenter) }
            { this.renderRequestButton(presenter) }
            { this.renderCancelButton(presenter) }
          </div>
        );
      case 'pending':
        return (
          <div>
            { this.renderAddLinkButton(presenter) }
            { this.renderCancelPendingButton(presenter) }
            { this.renderCancelButton(presenter) }
          </div>
        );
      case 'fulfilled':
        return (
          <div>
            { this.renderUpdateButton(presenter) }
          </div>
        );
      case 'missing':
        return (
          <div>
            { this.renderAddLinkButton(presenter) }
          </div>
        );
      default:
        return (
          <div>
            { this.renderAddLinkButton(presenter) }
            { this.renderCancelButton(presenter) }
          </div>
        );
    }
  }

};

module.exports = DocumentMixin;
