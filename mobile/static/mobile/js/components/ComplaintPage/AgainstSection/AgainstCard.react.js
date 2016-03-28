var React = require('react');

var AppHistory = require('utils/History');
var u = require('utils/HelperUtil');

var InvestigationTimeline = require('components/ComplaintPage/AgainstSection/AgainstCard/InvestigationTimeline.react');
var OfficerCard = require('components/Shared/OfficerCard.react');
var OfficerPresenter = require('presenters/OfficerPresenter');
var Wrapper = require('components/Shared/Wrapper.react');


var AgainstCard = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object,
    officerAllegation: React.PropTypes.object,
    shouldRenderTimelineOutside: React.PropTypes.bool
  },

  _onClick: function (officerPresenter) {
    var officerUrl = u.format('/officer/{name}/{id}', {
      'name': officerPresenter.displayName,
      'id': officerPresenter.id
    });
    AppHistory.pushState(null, officerUrl);
  },

  render: function () {
    var officerAllegation = this.props.officerAllegation;
    var officerPresenter = OfficerPresenter(u.fetch(officerAllegation, 'officer', {}));
    var allegation = this.props.allegation;

    return (
      <div className='against-card'>
        <div onClick={ this._onClick.bind(this, officerPresenter) }>
          <OfficerCard displayName={ officerPresenter.displayName }
            description={ officerPresenter.description }
            officerId={ officerPresenter.id }
            allegationsCount={ officerPresenter.allegationsCount }/>
        </div>
        <Wrapper visible={ !this.props.shouldRenderTimelineOutside } wrapperClass='timeline'>
          <InvestigationTimeline allegation={ allegation } officerAllegation={ officerAllegation }/>
        </Wrapper>
      </div>
    );
  }
});

module.exports = AgainstCard;
