var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;

var DocumentPresenter = require('presenters/DocumentPresenter');
var RequestDocumentActions = require('actions/RequestDocumentActions');


var Document = React.createClass({
  propTypes: {
    document: PropTypes.object.isRequired
  },

  _onClick: function (e) {
    var document = this.props.document;

    if (!document['documentcloud_id']) {
      e.preventDefault();
      RequestDocumentActions.request(document);
    }
  },

  renderDownloadLink: function (presenter) {
    return (
      <a className='document-action' href={ presenter.documentUrl } target='_blank'>View</a>
    );
  },

  renderRequestLink: function (presenter) {
    var text = presenter.status == 'Missing' ? 'Request' : 'Follow';
    return (
      <a className='document-action' href='javascript:void()' onClick={ this._onClick }>{ text }</a>
    );
  },

  renderDocumentAction: function (presenter) {
    switch (presenter.status) {
      case 'Available':
        return this.renderDownloadLink(presenter);
      case 'Missing':
      case 'Pending':
        return this.renderRequestLink(presenter);
    }
    return '';
  },

  render: function () {
    var presenter = DocumentPresenter(this.props.document);
    var titleClassName = classnames('document-title', {
      'not-available': presenter.status != 'Available'
    });

    return (
      <div>
        <div>
          <ul>
            <li className={ titleClassName }>{ presenter.title }</li>
          </ul>
        </div>
        <div>
          <span className='document-status'>{ presenter.status }</span>
          <span>{ this.renderDocumentAction(presenter) }</span>
        </div>
      </div>
    );
  }
});

module.exports = Document;
