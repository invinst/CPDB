var React = require('react');
var PropTypes = React.PropTypes;
var RequestDocumentActions = require('actions/RequestDocumentActions');
var RequestButtonStore = require('stores/Complaint/RequestButtonStore');


var RequestButton = React.createClass({
  propTypes: {
    complaint: PropTypes.object
  },

  getInitialState: function () {
    return RequestButtonStore.init(this.props.complaint.allegation);
  },

  componentDidMount: function () {
    RequestButtonStore.registerButton(this);
  },

  componentWillUnmount: function () {
    RequestButtonStore.unregisterButton(this);
  },

  onClick: function (e) {
    if (!this.props.complaint.allegation.document_id) {
      e.preventDefault();
      RequestDocumentActions.request(this.props.complaint);
    }
  },
  render: function () {
    var allegation = this.props.complaint.allegation;
    var documentLabel = 'Request';
    var linkClassName = 'btn btn-sm btn-request';
    var link = 'javascript:void()';
    var iconClassName = 'fa fa-file-pdf-o';
    var target = '';
    if (this.state.requested) {
      documentLabel = 'Pending';
    }
    if (allegation.document_id) {
      target = '_blank';
      documentLabel = 'View Document';
      link = 'http://documentcloud.org/documents/' + allegation.document_id + '-' +
             allegation.document_normalized_title +'.html';
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
