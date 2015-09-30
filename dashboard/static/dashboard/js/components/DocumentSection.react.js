var React = require('react');
var Base = require('./Base.react');
var DocumentList = require('./DocumentSection/DocumentList.react');
var Tabs = require('./DocumentSection/Tabs.react');
var DocumentSectionStore = require('../stores/DocumentSectionStore');
var DocumentSectionActions = require('../actions/DocumentSectionActions');
var DocumentRequestAPI = require('../utils/DocumentRequestAPI');
var AddDocumentLinkModal = require('./DocumentSection/AddDocumentLinkModal.react');
var _ = require('lodash');

var DocumentSection = React.createClass(_.assign(Base(DocumentSectionStore), {

  componentDidMount: function () {
    DocumentSectionStore.addChangeListener(this._onChange);
    //if (this.props.params.id) {
    //  DocumentSectionActions.loadOfficer(this.props.params.id);
    //}
    DocumentRequestAPI.get()
  },

  content: function () {
    //if (this.props.params.id) {
    //  return <Officer />
    //}
    return <DocumentList />
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
            <button className="btn btn-primary">Add document</button>
          </div>
        </div>
        <div>
          <div className='row'>
            <div className="col-md-12">
              <Tabs />
            </div>
          </div>
          <div className='row'>
            <div id='documents' className='col-md-12'>
              { this.content() }
            </div>
          </div>
        </div>
        <AddDocumentLinkModal />
      </div>
    )
  }
}));

module.exports = DocumentSection;
