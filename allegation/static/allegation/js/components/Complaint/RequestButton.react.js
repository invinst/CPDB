var React = require('react');
var RequestModal = require('./RequestModal.react');
var RequestDocumentActions = require('../../actions/RequestDocumentActions');
var RequestDocumentDispatcher = require('../../dispatcher/RequestDocumentDispatcher');
var RequestDocumentConstants = require('../../constants/RequestDocumentConstants');


var RequestButton = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {
    var that = this;
    RequestDocumentDispatcher.register(function (action) {
      if (action.actionType == RequestDocumentConstants.DOCUMENT_REQUESTED) {
        if (that.props.complaint.allegation.crid == action.value) {
          that.setState({
            requested: true
          });
        }
      }
    });
  },
  render: function () {
    var allegation = this.props.complaint.allegation;
    var documentLabel = 'Request';
    var linkClassName = 'btn btn-sm btn-request';
    var link = '#';
    var iconClassName = 'fa fa-file-pdf-o';
    var target = '';
    if (this.state.requested || allegation.document_requested) {
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
