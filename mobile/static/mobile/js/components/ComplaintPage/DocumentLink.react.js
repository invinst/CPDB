var React = require('react');

var DeviceUtil = require('utils/DeviceUtil');
var DocumentLinkPresenter = require('presenters/DocumentLinkPresenter');
var Wrapper = require('components/Shared/Wrapper.react');


var DocumentLink = React.createClass({
  propTypes: {
    documentId: React.PropTypes.string,
    documentNormalizedTitle: React.PropTypes.string
  },

  getDocumentLink: function (documentId, documentNormalizedTitle) {
    var presenter = DocumentLinkPresenter(documentId, documentNormalizedTitle);

    if (DeviceUtil.isiOSDevice()) {
      return presenter.pdfLink;
    }

    return presenter.cloudLink;
  },

  render: function () {
    var documentId = this.props.documentId;
    var documentNormalizedTitle = this.props.documentNormalizedTitle;

    return (
      <Wrapper visible={ !!documentId }>
        <a href={ this.getDocumentLink(documentId, documentNormalizedTitle) } className='document-link'>
          View documents
        </a>
      </Wrapper>
    );
  }
});

module.exports = DocumentLink;
