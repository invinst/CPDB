var React = require('react');

var DeviceUtil = require('utils/DeviceUtil');
var DocumentLinkPresenter = require('presenters/DocumentLinkPresenter');


var DocumentLink = React.createClass({
  propTypes: {
    documentId: React.PropTypes.string,
    documentNormalizedTitle: React.PropTypes.string
  },

  getDocumentLink: function (documentId, documentNormalizedTitle) {
    var presenter = DocumentLinkPresenter(documentId, documentNormalizedTitle);
    var deviceUtil = DeviceUtil();

    if (deviceUtil.isiOSDevice) {
      return presenter.pdfLink;
    }

    return presenter.cloudLink;
  },

  render: function () {
    var documentId = this.props.documentId;
    var documentNormalizedTitle = this.props.documentNormalizedTitle;

    if (!documentId) {
      return (<div></div>);
    }

    var documentLink = this.getDocumentLink(documentId, documentNormalizedTitle);
    return (
      <a href={ documentLink } className='document-link'>
        View documents
      </a>
    );
  }
});

module.exports = DocumentLink;
