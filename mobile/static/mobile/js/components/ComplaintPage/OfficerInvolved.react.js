var pluralize = require('pluralize');
var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');
var OfficerCard = require('components/Shared/OfficerCard.react');

var OfficerPresenter = require('presenters/OfficerPresenter');
var HelperUtil = require('utils/HelperUtil');
var OfficerUtil = require('utils/OfficerUtil');
var AppHistory = require('utils/History');



var OfficerInvolved = React.createClass({

  _onClick: function (officerPresenter) {
    var officer_url = HelperUtil.format('/officer/{name}/{id}', {
      'name': officerPresenter.displayName,
      'id': officerPresenter.id
    });
    AppHistory.pushState(null, officer_url);
  },

  renderOfficerRow: function (officer) {
    var officerPresenter = OfficerPresenter(officer);
    return (
      <div onClick={this._onClick.bind(this, officerPresenter)}>
        <OfficerCard
          officerId={officer.id}
          allegationsCount={officerPresenter.allegationsCount}
          displayName={officerPresenter.displayName}
          description={officerPresenter.description}
        />
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
            <span className='section-title bold'>{pluralize('Officer', numberOfInvolvedOfficers, false)}
              Involved&nbsp;</span>
            <span className='title-count normal-weight'>({numberOfInvolvedOfficers})</span>
          </span>
        </div>
        {this.renderOfficerList(officers)}
      </Wrapper>
    );
  }
});

module.exports = OfficerInvolved;
