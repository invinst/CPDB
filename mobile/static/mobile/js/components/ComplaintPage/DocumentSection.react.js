var React = require('react');

var DocumentCard = require('components/ComplaintPage/DocumentSection/DocumentCard.react');
var Wrapper = require('components/Shared/Wrapper.react');


var DocumentSection = React.createClass({
  propTypes: {
    documents: React.PropTypes.array
  },

  renderDocumentCard: function (document) {
    return (
      <DocumentCard document={ document } key={ document.id } />
    );
  },

  render: function () {
    var documents = this.props.documents || [];
    var numberOfDocuments = documents.length || 0;
    return (
      <Wrapper wrapperClass='document-section' visible={ !!numberOfDocuments }>
        <div className='row section-header'>
          <span className='section-title bold pad'>Document ({ numberOfDocuments })</span>
        </div>
        <div className='document-list pad'>
          { documents.map(this.renderDocumentCard) }
        </div>
      </Wrapper>
    );
  }
});

module.exports = DocumentSection;
