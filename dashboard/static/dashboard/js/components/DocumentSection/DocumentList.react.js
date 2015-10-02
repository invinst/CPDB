var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
var Base = require('../Base.react');
var DocumentListStore = require('../../stores/DocumentSection/DocumentListStore');
var DocumentListActions = require('../../actions/DocumentSection/DocumentListActions');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var DocumentMixin = require('./DocumentMixin');
var AppConstants = require('../../constants/AppConstants');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var AddDocumentLinkModalActions = require('../../actions/DocumentSection/AddDocumentLinkModalActions');

global.jQuery = require('jquery');

var DocumentList = React.createClass(_.assign(Base(DocumentListStore), {
  mixins: [DocumentMixin],

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
    DocumentRequestAPI.get();
    jQuery(window).on('scroll', this._onScroll);
  },

  componentWillUnmount: function () {
    jQuery(window).off('scroll', this._onScroll);
  },

  setActiveAllegation: function (allegation) {
    DocumentRequestAPI.loadDocument(allegation.id);
    DocumentListActions.setActive(allegation);
  },

  onClick: function (allegation) {
    return this.setActiveAllegation.bind(this, allegation);
  },


  renderDocumentList: function() {
    var that = this;
    return this.state.documents.map(function(x) {
      var status = that.getStatus(x.document_requested, x.document_id);
      var statusObj = that.getStatusObject(status);
      var statusText = statusObj.text;
      var statusIcon = statusObj.icon;

      var className = classnames('fa', "fa-" + statusIcon);

      return (
        <tr className='document' key={"crid" + x.crid} className={that.rowClassName(x)}>
          <td onClick={that.onClick(x)}>{x.crid}</td>
          <td className="status"><i className={className}></i> {statusText}</td>
          <td>{x.number_of_request}</td>
          <td className="actions">
            { that.renderDocumentActions(status, x) }
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
