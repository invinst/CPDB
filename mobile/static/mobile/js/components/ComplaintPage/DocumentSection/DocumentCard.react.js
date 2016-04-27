var React = require('react');

var cx = require('classnames');

var u = require('utils/HelperUtil');

var DocumentPresenter = require('presenters/DocumentPresenter');
var RequestModalContent = require('components/ComplaintPage/DocumentSection/DocumentCard/RequestModalContent.react');
var Modal = require('components/Lib/Modal.react');


var DocumentCard = React.createClass({
  propTypes: {
    document: React.PropTypes.object
  },

  renderActionTag: function (presenter, name) {
    if (presenter.documentAction == 'View') {
      return (
        <a href={ presenter.documentLink } className='action-type one-half column align-right'>
          { presenter.documentAction }
        </a>
      );
    }
    return (
      <a onClick={ Modal.dispatch(name, 'open') } className='action-type one-half column align-right'>
        { presenter.documentAction }
      </a>
    );
  },

  render: function () {
    var document = this.props.document;
    var presenter = DocumentPresenter(document);
    var isBlur = presenter.documentStatus != 'Available';
    var className = cx('document-name', {'blur': isBlur});
    var modalName = u.format('requestModal-{id}',{'id': u.fetch(document, 'id', '')});

    return (
      <div className='document-card row'>
        <div className='one column circle-wrapper center'>
          <div className='small-circle background-black circle'></div>
        </div>
        <div className='eleven columns'>
          <div className='document-detail one-half column align-left'>
            <div className={ className }>{ presenter.documentName }</div>
            <div className='status'>{ presenter.documentStatus }</div>
          </div>
          { this.renderActionTag(presenter, modalName) }
          <Modal name={ modalName }>
            <RequestModalContent document={ document } />
          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = DocumentCard;
