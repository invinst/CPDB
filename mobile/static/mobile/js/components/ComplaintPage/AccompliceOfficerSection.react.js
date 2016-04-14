var pluralize = require('pluralize');
var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');
var OfficerCard = require('components/Shared/OfficerCard.react');

var u = require('utils/HelperUtil');
var OfficerPresenter = require('presenters/OfficerPresenter');
var AppHistory = require('utils/History');


var AccompliceOfficerSection = React.createClass({
  propTypes: {
    officerAllegations: React.PropTypes.array
  },

  _onClick: function (officerPresenter) {
    AppHistory.pushState(null, officerPresenter.url);
  },

  renderOfficerRow: function (officerAllegation) {
    var officer = u.fetch(officerAllegation, 'officer', {});
    var officerPresenter = OfficerPresenter(officer);

    return (
      <div onClick={ this._onClick.bind(this, officerPresenter) } key={ officer.id }>
        <OfficerCard
          officerId={ officerPresenter.id }
          allegationsCount={ officerPresenter.allegationsCount }
          displayName={ officerPresenter.displayName }
          description={ officerPresenter.description }
        />
      </div>
    );
  },

  renderOfficerList: function (officerAllegations) {
    return (
      <div className='officer-list'>
        { officerAllegations.map(this.renderOfficerRow) }
      </div>
    );
  },

  render: function () {
    var officerAllegations = this.props.officerAllegations || [];
    var numberOfOfficerAllegations = officerAllegations.length;

    return (
      <Wrapper wrapperClass='accomplice-officer-section' visible={ numberOfOfficerAllegations > 0 }>
        <div className='row section-header'>
          <span className='pad'>
            <span className='section-title bold'>
              Accomplice { pluralize('Officer', numberOfOfficerAllegations, false) } &nbsp;
            </span>
            <span className='title-count normal-weight'>({ numberOfOfficerAllegations })</span>
          </span>
        </div>
        { this.renderOfficerList(officerAllegations) }
      </Wrapper>
    );
  }
});

module.exports = AccompliceOfficerSection;
