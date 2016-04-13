var React = require('react');

var u = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');

var AppHistory = require('utils/History');

var ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');
var AllegationPresenter = require('presenters/AllegationPresenter');
var OfficerAllegationPresenter = require('presenters/OfficerAllegationPresenter');
var OfficerPresenter = require('presenters/OfficerPresenter');
var CircleList = require('components/Shared/OfficerAllegationItem/CircleList.react');


var OfficerAllegationItem = React.createClass({
  propTypes: {
    officerAllegation: React.PropTypes.object,
    allegation: React.PropTypes.object,
    officerAllegations: React.PropTypes.array
  },

  _onClick : function (crid, firstOfficerAllegation) {
    var presenter = OfficerAllegationPresenter(firstOfficerAllegation);
    AppHistory.pushState(null, presenter.url(crid));
    ComplaintPageActions.resetState();
  },

  render: function () {
    var allegation = this.props.allegation;
    var officerAllegations = this.props.officerAllegations;
    var firstOfficerAllegation = this.props.officerAllegation;

    var officer = u.fetch(firstOfficerAllegation, 'officer', null);

    var numberOfInvolvedOfficers = officerAllegations.length - 1; // exclude himself
    var allegationCounts = CollectionUtil.pluck(officerAllegations, 'officer.allegations_count');

    var officerPresenter = OfficerPresenter(officer);
    var allegationPresenter = AllegationPresenter(allegation);
    var officerAllegationPresenter = OfficerAllegationPresenter(firstOfficerAllegation);
    var crid = allegationPresenter.crid;

    return (
      <div className='officer-complaint-item' onClick={ this._onClick.bind(this, crid, firstOfficerAllegation) }>
        <div className='crid-info pad'>
          <div className='inline-block half-width align-left'>
            <span className='crid-title'>CRID &nbsp;</span>
            <span className='crid-number'>{ crid }</span>
          </div>
          <div className='inline-block half-width align-right'>
            <span className='final-finding'>{ officerAllegationPresenter.finalFinding }</span>
          </div>
        </div>
        <div className='complaint-category'>
          <div className='pad'>
            <div className='category'>{ officerAllegationPresenter.category }</div>
            <div className='sub-category'>{ officerAllegationPresenter.allegationName }</div>
          </div>
        </div>
        <div className='related-info pad'>
          <div className='row'>
            <span className='label'>Incident</span>
            <span className='value'>{ allegationPresenter.incidentDateDisplay }</span>
          </div>
          <div className='row'>
            <span className='label'>Against</span>
            <span className='value'>
              { officerPresenter.coAccusedWith(numberOfInvolvedOfficers) }
            </span>
          </div>
          <div className='circles row'>
            <CircleList allegationCountList={ allegationCounts } />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerAllegationItem;
