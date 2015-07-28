var React = require('react');


var RequestButton = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {

  },
  render: function () {
    var allegation = this.props.complaint.allegation;
    var documentLabel = 'Request';
    var linkClassName = 'btn btn-sm btn-request';
    var link = '#';
    var iconClassName = 'fa fa-file-pdf-o';
    if (allegation.document_id) {
      documentLabel = 'View Document';
      link = 'http://documentcloud.org/documents/' + allegation.document_id + '-' +
             allegation.document_normalized_title +'.html';
      linkClassName = 'btn btn-sm btn-view';
      iconClassName = 'fa fa-download';
    }
    return (
      <a className={linkClassName} href={link} target='_blank'>
        <i className={iconClassName}></i> {documentLabel}
      </a>
    );
  }
});

module.exports = RequestButton;
