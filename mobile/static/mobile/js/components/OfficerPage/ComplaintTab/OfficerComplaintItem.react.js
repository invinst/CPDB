var React = require('react');
var cx = require('classnames');

var AppHistory = require('utils/History');

var AllegationPresenter = require('presenters/AllegationPresenter');
var OfficerAllegationPresenter = require('presenters/OfficerAllegationPresenter');
var OfficerPresenter = require('presenters/OfficerPresenter');
var OfficerUtil = require('utils/OfficerUtil');
var HelperUtil = require('utils/HelperUtil');


var OfficerComplaintItem = React.createClass({
  propTypes: {
    complaint: React.PropTypes.object,
    officer: React.PropTypes.object
  },

  renderCircles: function (allegationCounts) {
    var circles = [];
    var i;

    for (i = 0; i < allegationCounts.length; i++) {
      circles.push(
        <div className={ cx('circle-wrapper', HelperUtil.format('officer-{index}', {'index': i})) } key={ i }>
          <span className={ cx('circle', OfficerUtil.getColorLevelClass('circle', allegationCounts[i])) } />
        </div>
      );
    }

    return circles;
  },

  _onClicked : function (crid) {
    var complaint = this.props.complaint.data;
    var presenter = OfficerAllegationPresenter(complaint);
    AppHistory.pushState(null, presenter.url(crid));
  },

  render: function () {
    var complaint = this.props.complaint.data;
    var numberOfInvolvedOfficers = this.props.complaint['allegation_counts'].length - 1; // exclude himself
    var allegationCounts = this.props.complaint['allegation_counts'];
    var officer = this.props.officer;

    var officerPresenter = OfficerPresenter(officer);
    var allegationPresenter = AllegationPresenter(HelperUtil.fetch(complaint, 'allegation', {}));
    var officerAllegationPresenter = OfficerAllegationPresenter(complaint);
    var crid = allegationPresenter.crid;

    return (
      <div className='officer-complaint-item' onClick={ this._onClicked.bind(this, crid) }>
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
            <span className='label'>Officers</span>
            <span className='value'>
              { officerPresenter.coAccusedWith(numberOfInvolvedOfficers) }
            </span>
          </div>
          <div className='circles row'>
            { this.renderCircles(allegationCounts) }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerComplaintItem;
