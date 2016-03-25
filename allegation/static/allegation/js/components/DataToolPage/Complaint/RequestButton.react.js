var React = require('react');
var PropTypes = React.PropTypes;

var RequestDocumentActions = require('actions/RequestDocumentActions');
var RequestButtonStore = require('stores/Complaint/RequestButtonStore');


var RequestButton = React.createClass({
  propTypes: {
    document: PropTypes.object
  },

  getInitialState: function () {
    return RequestButtonStore.init(this.props.document);
  },

  componentDidMount: function () {
    RequestButtonStore.registerButton(this);
  },

  componentWillUnmount: function () {
    RequestButtonStore.unregisterButton(this);
  },

  onClick: function (e) {
    var document = this.props.document;

    if (!document.documentcloud_id) {
      e.preventDefault();
      RequestDocumentActions.request(document);
    }
  },

  render: function () {
    var documentLabel = 'Request';
    var linkClassName = 'btn btn-sm btn-request';
    var link = 'javascript:void()';
    var iconClassName = 'fa fa-file-pdf-o';
    var target = '';
    var document = this.props.document;

    if (this.state.requested) {
      documentLabel = 'Pending';
    }

    if (document && document.documentcloud_id) {
      target = '_blank';
      documentLabel = 'View Document';
      link = 'http://documentcloud.org/documents/' + document.documentcloud_id + '-' +
             document.normalized_title +'.html';
      linkClassName = 'btn btn-sm btn-view';
      iconClassName = 'fa fa-download';
    }

    return (
      <a className={ linkClassName } href={ link } target={ target } onClick={ this.onClick }>
        <i className={ iconClassName }></i> { documentLabel }
      </a>
    );
  }
});

module.exports = RequestButton;
