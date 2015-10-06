var React = require('react');
var RequestModal = require('components/HomePage/Complaint/RequestModal.react');
var RequestDocumentActions = require('actions/RequestDocumentActions');
var RequestButtonStore = require('stores/Complaint/RequestButtonStore');


var RequestButton = React.createClass({
  getInitialState: function () {
    return RequestButtonStore.init(this.props.complaint.allegation);
  },

  componentDidMount: function () {
    RequestButtonStore.registerButton(this);
  },

  componentWillUnmount: function () {
    RequestButtonStore.unregisterButton(this);
  },

  render: function () {
    var allegation = this.props.complaint.allegation;
    var documentLabel = 'Request';
    var linkClassName = 'btn btn-sm btn-request';
    var link = 'javascript:void()';
    var iconClassName = 'fa fa-file-pdf-o';
    var target = '';
    if (this.state.requested) {
      documentLabel = 'Requested';
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
      <a className={linkClassName} href={link} target={target} onClick={this.onClick}>
        <i className={iconClassName}></i> {documentLabel}
      </a>
    );
  },
  onClick: function (e) {
    if (!this.props.complaint.allegation.document_id) {
      e.preventDefault();
      RequestDocumentActions.request(this.props.complaint);
    }
  }
});


module.exports = RequestButton;
