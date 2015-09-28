var React = require('react');
var _ = require('lodash');
var classnames = require('classnames')
var Base = require('../Base.react');
var DocumentListStore = require('../../stores/DocumentSection/DocumentListStore');
var DocumentListActions = require('../../actions/DocumentSection/DocumentListActions');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');

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
      return 'Fulfilled';
    }

    if (requested) {
      return 'Requesting';
    }

    return 'Missing';
  },

  rowClassName: function (allegation) {
    return classnames({
      requested: allegation.document_requested,
      fulfilled: allegation.document_id
    });
  },

  renderDocumentList: function() {
    var that = this;
    return this.state.documents.map(function(x) {
      return (
        <tr className='document' key={"crid" + x.crid} className={that.rowClassName(x)}>
          <td>{x.crid}</td>
          <td className="status">{that.getStatus(x.document_requested, x.document_id)}</td>
          <td>{x.number_of_request}</td>
          <td className="actions">
            <button className="btn btn-primary">
              <i className="fa fa-link"></i> Add
            </button>
            <button className="btn btn-cancel">
              <i className="fa fa-times"></i> Cancel
            </button>
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
