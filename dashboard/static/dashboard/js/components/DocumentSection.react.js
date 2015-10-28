var React = require('react');
var Base = require('./Base.react');
var Document = require('./DocumentSection/Document.react');
var DocumentList = require('./DocumentSection/DocumentList.react');
var Tabs = require('./DocumentSection/Tabs.react');
var DocumentSectionStore = require('../stores/DocumentSectionStore');
var DocumentRequestAPI = require('../utils/DocumentRequestAPI');
var AddDocumentLinkModal = require('./DocumentSection/AddDocumentLinkModal.react');
var AddDocumentLinkModalActions = require('../actions/DocumentSection/AddDocumentLinkModalActions');
var DocumentListActions = require('../actions/DocumentSection/DocumentListActions');
var _ = require('lodash');


var DocumentSection = React.createClass(_.assign(Base(DocumentSectionStore), {

  componentDidMount: function () {
    DocumentSectionStore.addChangeListener(this._onChange);
    this.fetchData();
  },

  fetchData: function () {
    if (this.props.params.id) {
      DocumentRequestAPI.loadDocument(this.props.params.id);
    }
  },

  content: function () {
    if (this.props.params.id) {
      return (
        <div id='documents' className='col-md-12'>
          <Document />
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

  keyEntered: function(e) {
    if (e.keyCode == 13) {
      DocumentRequestAPI.loadByCrid(e.target.value);
    }
  },

  render: function() {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-6 col-xs-6'>
            <h1>
              Investigation Documents
            </h1>
          </div>
          <div className='col-md-4 col-xs-4 text-right'>
            <input className='form-control crid-request-search' type="number" placeholder='Enter CRID' onKeyDown={this.keyEntered} defaultValue="" />
          </div>
          <div className='col-md-2 col-xs-2 text-right'>
            <button id="add-document" className="btn btn-primary" onClick={this.showAddLinkModal}>
              <i className="fa fa-link"></i> Add document
            </button>
          </div>
        </div>
        <div>
          <div className='row'>
            { this.content() }
          </div>
        </div>
        <AddDocumentLinkModal />
      </div>
    )
  }
}));

module.exports = DocumentSection;
