var React = require('react');

var cx = require('classnames');
var DocumentPresenter = require('presenters/DocumentPresenter');


var DocumentCard = React.createClass({
  propTypes: {
    document: React.PropTypes.object
  },

  render: function () {
    var presenter = DocumentPresenter(this.props.document);
    var isBlur = presenter.documentStatus != 'Available';
    var className = cx('document-name', {'blur': isBlur});
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
          <a href={ presenter.documentLink } className='action-type one-half column align-right'>
            { presenter.documentAction }
          </a>
        </div>
      </div>
    );
  }
});

module.exports = DocumentCard;
