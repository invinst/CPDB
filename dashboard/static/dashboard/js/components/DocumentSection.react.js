var React = require('react');
var Base = require('./Base.react');
var Document = require('./DocumentSection/Document.react');
var DocumentList = require('./DocumentSection/DocumentList.react');
var Tabs = require('./DocumentSection/Tabs.react');
var DocumentSectionStore = require('../stores/DocumentSectionStore');
var DocumentSectionActions = require('../actions/DocumentSectionActions');
var DocumentRequestAPI = require('../utils/DocumentRequestAPI');
var AddDocumentLinkModal = require('./DocumentSection/AddDocumentLinkModal.react');
var AddDocumentLinkModalActions = require('../actions/DocumentSection/AddDocumentLinkModalActions');
var _ = require('lodash');

var DocumentSection = React.createClass(_.assign(Base(DocumentSectionStore), {

  componentDidMount: function () {
    DocumentSectionStore.addChangeListener(this._onChange);
    this.fetchData();
  },

  componentDidUpdate: function () {
    this.fetchData();
  },

  fetchData: function () {
    if (this.props.params.id) {
      DocumentRequestAPI.loadDocument(this.props.params.id);
    } else {
      DocumentRequestAPI.get()
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

  render: function() {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-6 col-xs-6'>
            <h1>
              Investigation Documents
            </h1>
          </div>
          <div id='search-officer' className='col-md-6 col-xs-6 text-right'>
            <button className="btn btn-primary" onClick={this.showAddLinkModal}>Add document</button>
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
