var _ = require('lodash');
var React = require('react');

var Base = require('components/Base.react');
var AppConstants = require('../constants/AppConstants');

var Document = require('components/DocumentSection/Document.react');
var DocumentList = require('components/DocumentSection/DocumentList.react');
var Tabs = require('./DocumentSection/Tabs.react');
var DocumentSectionStore = require('stores/DocumentSectionStore');
var DocumentRequestAPI = require('utils/DocumentRequestAPI');
var AddDocumentLinkModal = require('components/DocumentSection/AddDocumentLinkModal.react');
var AddDocumentLinkModalActions = require('actions/DocumentSection/AddDocumentLinkModalActions');
var UploadDocumentModal = require('components/DocumentSection/UploadDocumentModal.react');
var DocumentCrawlStats = require('./DocumentSection/DocumentCrawlStats.react');


var DocumentSection = React.createClass(_.assign(Base(DocumentSectionStore), {
  isShowingSingleDocument: function () {
    return !!this.props.params.id;
  },

  content: function () {
    if (this.isShowingSingleDocument()) {
      return (
        <div id='documents' className='col-md-12'>
          <Document documentId={ this.props.params.id } />
        </div>
      );
    }
    return (
      <div id='documents' className='col-md-12'>
        <Tabs />
        <DocumentList />
      </div>
    );
  },

  showAddLinkModal: function () {
    AddDocumentLinkModalActions.show();
  },

  showUploadModal: function () {
    this.setState({ uploadModalIsOpen: true });
  },

  exportDocument: function () {
    window.location.href = AppConstants.DOCUMENT_EXPORT_END_POINT + '?document_type=' + this.state.documentType;
  },

  keyEntered: function (e) {
    if (e.keyCode == 13) {
      DocumentRequestAPI.getSingleDocumentByCrid(e.target.value, this.state.documentType);
    }
  },

  closeUploadModal: function () {
    this.setState({ uploadModalIsOpen: false });
  },

  render: function () {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-4 col-xs-4'>
            <h1>
              Investigation Documents
            </h1>
          </div>
          <div className='col-md-3 col-xs-3 text-right'>
            <input className='form-control crid-request-search' type='number'
              placeholder='Enter CRID' onKeyDown={ this.keyEntered } defaultValue='' />
          </div>
          <div className='col-md-5 col-xs-5 text-right'>
            <button className='btn btn-primary btn-upload-document' onClick={ this.showUploadModal }>
              <i className='fa fa-link'></i> Upload document
            </button>
            <button id='add-document' className='btn btn-primary' onClick={ this.showAddLinkModal }>
              <i className='fa fa-link'></i> Add document
            </button>
            <button id='export-document' className='btn btn-primary' onClick={ this.exportDocument }>
              <i className='fa fa-file-excel-o'></i> Export requests to Excel
            </button>
          </div>
        </div>
        <div>
          <div className='row'>
            <DocumentCrawlStats />
          </div>
          <div className='row'>
            { this.content() }
          </div>
        </div>
        <AddDocumentLinkModal documentType={ this.state.documentType } />
        <UploadDocumentModal isOpen={ this.state.uploadModalIsOpen } onRequestClose={ this.closeUploadModal } />
      </div>
    );
  }
}));

module.exports = DocumentSection;
