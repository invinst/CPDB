var React = require('react');
var pluralize = require('pluralize');
var cx = require('classnames');

var OfficerPresenter = require('presenters/OfficerPresenter');
var OfficerUtil = require('utils/OfficerUtil');
var HelperUtil = require('utils/HelperUtil');


var RelatedOfficerItem = React.createClass({
  render: function () {
    var type = this.props.type;
    var officer = this.props.officer;

    var numberOfAllegations = officer['num_allegations'];
    var presenter = OfficerPresenter(officer);
    var officerUtil = OfficerUtil();
    var relatedOfficerClassName = cx('related-officer-item', 'pad', HelperUtil.format('officer-{index}', {'index': presenter.id}))
    return (

      <div className={relatedOfficerClassName}>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <span className={cx('circle', officerUtil.getStarClass(presenter.allegationsCount))}></span>
          </div>
          <div className='eleven columns'>
            <div className='name bold'>{presenter.displayName}</div>
            <div className='gender'>{presenter.description}</div>
            <div className='description'>{type} in {pluralize('case', numberOfAllegations, true)}</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficerItem;
