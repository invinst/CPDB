var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var Document = require('components/DataToolPage/Complaint/Document.react');


var Documents = React.createClass({
  propTypes: {
    documents: PropTypes.array.isRequired
  },

  renderDocuments: function () {
    return _.map(this.props.documents, function (document, index) {
      return <Document document={ document } key={ index } />;
    });
  },

  render: function () {
    return (
      <div>
        <div className='title'>Documents</div>
        <div className='documents'>
          { this.renderDocuments() }
        </div>
        <div className='download-all-btn'></div>
      </div>
    );
  }
});

module.exports = Documents;
