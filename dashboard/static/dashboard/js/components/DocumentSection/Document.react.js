var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var DocumentStore = require('../../stores/DocumentSection/DocumentStore');
var DocumentMixin = require('./DocumentMixin');
var QueryList = require('./QueryList.react');
var cx = require('classnames');

var Document = React.createClass(_.assign(Base(DocumentStore), {
  mixins: [DocumentMixin],

  goBack: function (e) {
    if (e) {
      e.preventDefault();
    }

    history.go(-1);
  },

  getRequestCount: function () {
    var document = this.state.document;
    if (!document.document_requested && !document.document_id) {
      return '';
    }
    return (
      <span> | { document.number_of_request } requests </span>
    );
  },

  render: function () {
    var document = this.state.document;
    var status,
      statusObj,
      statusClass,
      className;

    if (!document) {
      return <div></div>;
    }

    status = this.getStatus(document);
    statusObj = this.getStatusObject(status);

    statusClass = cx('status', status);
    className = cx('fa', 'fa-' + statusObj.icon);

    return (
      <div>
        <div className='row allegation'>
          <div className='col-md-12'>
            <a href='#' onClick={ this.goBack }>
              <i className='fa fa-angle-double-left'></i> Back
            </a>
          </div>
          <div className='col-md-9'>
            <h4 className='inline-block'>{ document.crid } information</h4>
            &nbsp;<span className={ statusClass }><i className={ className }></i> { statusObj.text }</span>
            { this.getRequestCount() }
          </div>
          <div className='col-md-3'>
            { this.renderDocumentActions(status, document) }
          </div>
        </div>
        <QueryList document={ document } />
      </div>
    );
  }

}));

module.exports = Document;
