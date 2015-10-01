var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var DocumentStore = require('../../stores/DocumentSection/DocumentStore');
var DocumentActions = require('../../actions/DocumentSection/DocumentActions');
var DocumentMixin = require('./DocumentMixin');
var QueryList = require('./QueryList.react');
var AppConstants = require('../../constants/AppConstants');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var cx = require('classnames');

var Document = React.createClass(_.assign(Base(DocumentStore), {
  mixins: [DocumentMixin],

  goBack: function (e) {
    if (e) {
      e.preventDefault();
    }

    history.go(-1);
  },

  render: function () {
    var document = this.state.document;
    if (!document) {
      return <div></div>;
    }

    var status = this.getStatus(document.document_requested, document.document_id);
    var statusObj = this.getStatusObject(status);

    var statusClass = cx('status', status);
    var className = cx('fa', "fa-" + statusObj.icon);

    return (
      <div>
        <div className="row allegation">
          <div className="col-md-12">
            <a href="#" onClick={this.goBack}>
              <i className="fa fa-angle-double-left"></i> Back
            </a>
          </div>
          <div className="col-md-9">
            <h4 className="inline-block">{document.crid} information</h4>
            &nbsp;<span className={statusClass}><i className={className}></i> {statusObj.text}</span>
            &nbsp;| {document.number_of_request} requests
          </div>
          <div className="col-md-3">
            { this.renderDocumentActions(status, document.crid) }
          </div>
        </div>
        <QueryList queries={document.queries} />
      </div>
    );
  }

}));

module.exports = Document;
