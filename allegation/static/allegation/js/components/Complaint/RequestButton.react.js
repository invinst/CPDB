var React = require('react');
var RequestModal = require('./RequestModal.react');
var RequestDocumentActions = require('../../actions/RequestDocumentActions');
var RequestDocumentDispatcher = require('../../dispatcher/RequestDocumentDispatcher');
var RequestDocumentConstants = require('../../constants/RequestDocumentConstants');


function setRequestedCrid(crid){
  $.cookie("requested_document_" + crid, "1", {path: '/'})
}

function isCridRequested(crid){
  return $.cookie("requested_document_" + crid);
}


var RequestButton = React.createClass({
  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
    var that = this;
    this.token = RequestDocumentDispatcher.register(function (action) {
      if (action.actionType == RequestDocumentConstants.DOCUMENT_REQUESTED) {
        if (that.props.complaint.allegation.crid == action.value) {
          that.setState({
            requested: true
          });
        }
      }
    });
  },

  componentWillUnmount: function () {
    RequestDocumentDispatcher.unregister(this.token);
  },

  render: function () {
    var allegation = this.props.complaint.allegation;
    var documentLabel = 'Request';
    var linkClassName = 'btn btn-sm btn-request';
    var link = '#';
    var iconClassName = 'fa fa-file-pdf-o';
    var target = '';
    if (this.state.requested || allegation.document_requested || isCridRequested(allegation.crid)) {
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


RequestDocumentDispatcher.register(function (action) {
  if (action.actionType == RequestDocumentConstants.DOCUMENT_REQUESTED) {
    setRequestedCrid(action.value);
  }
});


module.exports = RequestButton;
