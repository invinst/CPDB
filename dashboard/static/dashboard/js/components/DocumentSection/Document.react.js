var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;

var Base = require('components/Base.react');
var DocumentStore = require('stores/DocumentSection/DocumentStore');
var DocumentMixin = require('components/DocumentSection/DocumentMixin');
var QueryList = require('components/DocumentSection/QueryList.react');
var DocumentRequestAPI = require('utils/DocumentRequestAPI');
var AllegationDocumentPresenter = require('presenters/AllegationDocumentPresenter');


var Document = React.createClass(_.assign(Base(DocumentStore), {
  propTypes: {
    documentId: PropTypes.string
  },
  mixins: [DocumentMixin],

  componentDidMount: function () {
    DocumentStore.addChangeListener(this._onChange);
    DocumentRequestAPI.getSingleDocument(this.props.documentId);
  },

  goBack: function (event) {
    if (event) {
      event.preventDefault();
    }

    history.go(-1);
  },

  renderRequestCount: function (presenter) {
    if (presenter.numberOfDocumentRequests == 0) {
      return '';
    }
    return (
      <span> | { presenter.numberOfDocumentRequests } requests </span>
    );
  },

  render: function () {
    var document = this.state.document;
    var documentPresenter = AllegationDocumentPresenter(document);
    var statusClass,
      className;

    if (!document) {
      return <div></div>;
    }

    statusClass = classnames('status', documentPresenter.documentStatus);
    className = classnames('fa', 'fa-' + documentPresenter.documentStatusIcon);

    return (
      <div>
        <div className='row allegation'>
          <div className='col-md-12'>
            <a href='#' onClick={ this.goBack }>
              <i className='fa fa-angle-double-left'></i> Back
            </a>
          </div>
          <div className='col-md-9'>
            <h4 className='inline-block'>{ documentPresenter.crid } information</h4>
            &nbsp;
            <span className={ statusClass }>
              <i className={ className }></i> { documentPresenter.documentStatusText }
            </span>
            { this.renderRequestCount(documentPresenter) }
          </div>
          <div className='col-md-3'>
            { this.renderDocumentActions(documentPresenter) }
          </div>
        </div>
        <QueryList document={ document } />
      </div>
    );
  }

}));

module.exports = Document;
