var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
var Base = require('../Base.react');
var DocumentListStore = require('../../stores/DocumentSection/DocumentListStore');
var DocumentListActions = require('../../actions/DocumentSection/DocumentListActions');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var AppConstants = require('../../constants/AppConstants');
var AddDocumentLinkModalActions = require('../../actions/DocumentSection/AddDocumentLinkModalActions');

global.jQuery = require('jquery');

var DocumentList = React.createClass(_.assign(Base(DocumentListStore), {

  _onScroll: function(e) {
    var windowHeight = window.innerHeight;
    var toBottom = jQuery(document).height() - windowHeight - jQuery(window).scrollTop();

    if (toBottom <= 100 && !this.state.locked) {
      DocumentRequestAPI.loadMore();
      DocumentListActions.lockScroll();
    }
  },

  componentDidMount: function () {
    DocumentListStore.addChangeListener(this._onChange);
    jQuery(window).on('scroll', this._onScroll);
  },

  getStatus: function (requested, id) {
    if (id) {
      return 'fulfilled';
    }

    if (requested) {
      return 'requesting';
    }

    return 'missing';
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
    if (status != AppConstants.DOCUMENT_STATUS['fulfilled']) {
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
          <button className="btn btn-primary inverse">
            <i className="fa fa-refresh"></i> Update
          </button>
        </div>
      );
    }
  },

  renderDocumentList: function() {
    var that = this;
    return this.state.documents.map(function(x) {
      var status = that.getStatus(x.document_requested, x.document_id);
      var statusText = AppConstants.DOCUMENT_STATUS[status]['text'];
      var statusIcon = AppConstants.DOCUMENT_STATUS[status]['icon'];

      var className = classnames('fa', "fa-" + statusIcon);

      return (
        <tr className='document' key={"crid" + x.crid} className={that.rowClassName(x)}>
          <td>{x.crid}</td>
          <td className="status"><i className={className}></i> {statusText}</td>
          <td>{x.number_of_request}</td>
          <td className="actions">
            { that.renderDocumentActions(statusText, x.crid) }
          </td>
        </tr>
      )
    });
  },

  render: function() {
    return (
      <div className='table-responsive'>
        <table className='table table-striped table-hover'>
          <thead>
            <tr>
              <th>CRID</th>
              <th>Status</th>
              <th>No. of requests</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { this.renderDocumentList() }
          </tbody>
        </table>
      </div>
    );
  }
}));

module.exports = DocumentList;
