var React = require('react');
var classnames = require('classnames');
var AppConstants = require('../../constants/AppConstants');
var AddDocumentLinkModalActions = require('../../actions/DocumentSection/AddDocumentLinkModalActions');

var DocumentMixin = {
  getStatus: function (requested, id) {
    if (id) {
      return 'fulfilled';
    }

    if (requested) {
      return 'requesting';
    }

    return 'missing';
  },

  getStatusObject: function (status) {
    return AppConstants.DOCUMENT_STATUS[status];
  },

  rowClassName: function (allegation) {
    return classnames({
      requested: allegation.document_requested,
      fulfilled: allegation.document_id
    });
  },

  showAddLinkModal: function (crid) {
    AddDocumentLinkModalActions.show(crid);
  },

  renderDocumentActions: function(status, crid) {
    if (status != 'fulfilled') {
      return (
        <div>
          <button className="btn btn-primary" onClick={this.showAddLinkModal.bind(this, crid)}>
            <i className="fa fa-link"></i> Add
          </button>
          <button className="btn btn-cancel">
            <i className="fa fa-times"></i> Cancel
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button className="btn btn-primary inverse" onClick={this.showAddLinkModal.bind(this, crid)}>
            <i className="fa fa-refresh"></i> Update
          </button>
        </div>
      );
    }
  },

};

module.exports = DocumentMixin;
