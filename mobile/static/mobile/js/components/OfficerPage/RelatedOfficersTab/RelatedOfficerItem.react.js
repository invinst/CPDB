var React = require('react');
var pluralize = require('pluralize');
var cx = require('classnames');
var AppHistory = require('utils/History');

var OfficerPresenter = require('presenters/OfficerPresenter');
var OfficerUtil = require('utils/OfficerUtil');
var HelperUtil = require('utils/HelperUtil');


var RelatedOfficerItem = React.createClass({
  propTypes: {
    officer: React.PropTypes.object,
    type: React.PropTypes.string
  },

  _onClick: function () {
    var officer = this.props.officer;
    var presenter = OfficerPresenter(officer);
    var officerUrl = HelperUtil.format('/officer/{name}/{id}', {'name': presenter.displayName, 'id': presenter.id});
    AppHistory.pushState(null, officerUrl);
  },

  render: function () {
    var type = this.props.type;
    var officer = this.props.officer;

    var numberOfAllegations = officer['num_allegations'];
    var presenter = OfficerPresenter(officer);
    var relatedOfficerClassName = cx('related-officer-item', 'pad',
      HelperUtil.format('officer-{index}', {'index': presenter.id})
    );

    return (
      <div className={ relatedOfficerClassName } onClick={ this._onClick }>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <span className={ cx('circle', OfficerUtil.getColorLevelClass('circle', presenter.allegationsCount)) } />
          </div>
          <div className='eleven columns'>
            <div className='name bold'>{ presenter.displayName }</div>
            <div className='gender'>{ presenter.description }</div>
            <div className='description'>{ type } in { pluralize('case', numberOfAllegations, true) }</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficerItem;
