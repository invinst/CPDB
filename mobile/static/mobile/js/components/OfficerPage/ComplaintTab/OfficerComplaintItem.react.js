var React = require('react');
var cx = require('classnames');

var AppHistory = require('utils/History');

var ComplaintPresenter = require('presenters/ComplaintPresenter');
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

  _onClicked : function () {
    var complaint = this.props.complaint.data;
    var presenter = ComplaintPresenter(complaint);
    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    var complaint = this.props.complaint.data;
    var numberOfInvolvedOfficers = this.props.complaint['allegation_counts'].length - 1; // exclude himself
    var allegationCounts = this.props.complaint['allegation_counts'];
    var officer = this.props.officer;

    var officerPresenter = OfficerPresenter(officer);
    var complaintPresenter = ComplaintPresenter(complaint);
    return (
      <div className='officer-complaint-item' onClick={ this._onClicked }>
        <div className='crid-info pad'>
          <div className='inline-block half-width align-left'>
            <span className='crid-title'>CRID &nbsp;</span>
            <span className='crid-number'>{ complaintPresenter.crid }</span>
          </div>
          <div className='inline-block half-width align-right'>
            <span className='final-finding'>{ complaintPresenter.finalFinding }</span>
          </div>
        </div>
        <div className='complaint-category'>
          <div className='pad'>
            <div className='category'>{ complaintPresenter.category }</div>
            <div className='sub-category'>{ complaintPresenter.allegationName }</div>
          </div>
        </div>
        <div className='related-info pad'>
          <div className='row'>
            <span className='label'>Incident</span>
            <span className='value'>{ complaintPresenter.incidentDate }</span>
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
