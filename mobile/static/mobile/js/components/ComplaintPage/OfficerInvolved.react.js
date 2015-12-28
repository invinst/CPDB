var pluralize = require('pluralize');
var React = require('react');
var cx = require('classnames');

var OfficerPresenter = require('presenters/OfficerPresenter');
var Wrapper = require('components/Shared/Wrapper.react');
var HelperUtil = require('utils/HelperUtil');
var OfficerUtil = require('utils/OfficerUtil');



var OfficerInvolved = React.createClass({
  renderOfficerRow: function (officer) {
    var officerPresenter = OfficerPresenter(officer);
    var officerUtil = OfficerUtil();
    var officerClassname = HelperUtil.format('officer-{id}', {'id': officer.id});
    var classNames = cx('officer-card pad', officerClassname);
    var circleClassNames = cx('circle', officerUtil.getStarClass(officerPresenter.allegationsCount));

    return (
      <div className={classNames}>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <div className={circleClassNames}></div>
          </div>
          <div className='eleven columns'>
            <div className='officer'>
              <div className='name bold'>{officerPresenter.displayName}</div>
              <div className='description'>{officerPresenter.description}</div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderOfficerList: function (involvedOfficers) {
    return (
      <div className='officer-list'>
        {involvedOfficers.map(this.renderOfficerRow)}
      </div>
    );
  },

  render: function () {
    var officers = this.props.involvedOfficers || [];
    var numberOfInvolvedOfficers = officers.length;

    return (
      <Wrapper wrapperClass='officer-involved' visible={numberOfInvolvedOfficers > 0}>
        <div className='row section-header'>
          <span className='pad'>
            <span className='section-title bold'>{pluralize('Officer', numberOfInvolvedOfficers, false)} Involved&nbsp;</span>
            <span className='title-count normal-weight'>({numberOfInvolvedOfficers})</span>
          </span>
        </div>
        {this.renderOfficerList(officers)}
      </Wrapper>
    );
  }
});

module.exports = OfficerInvolved;
