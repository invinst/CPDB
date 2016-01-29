var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');
var moment = require('moment');

var Base = require('components/Base.react');
var ComplaintListActions = require('actions/ComplaintList/ComplaintListActions');
var ComplaintListStore = require('stores/ComplaintListStore');
var SessionAPI = require('utils/SessionAPI');
var Allegation = require('components/DataToolPage/Allegation.react');
var RequestButton = require('components/DataToolPage/Complaint/RequestButton.react');


var ComplaintListRow = React.createClass(_.assign(Base(ComplaintListStore), {

  detailRendered: function () {
    return this.state.hasShown || this.detailIsCurrentlyShown();
  },

  detailIsCurrentlyShown: function () {
    return this.state.activeComplaints.indexOf(this.props.complaint['officer_allegation'].id) > -1;
  },

  render: function () {
    var complaint = this.props.complaint;

    var detailIsShown = this.detailIsCurrentlyShown();

    var showMore = '';
    if (this.detailRendered()) {
      showMore = (
        <Allegation
          allegation={ complaint }
          hide={ !detailIsShown }
          toggleAllegation={ this.toggleComplaint } />
      );
    }

    var allegation = complaint.allegation;
    var officerAllegation = complaint['officer_allegation'];
    var category = {};
    if (this.props.complaint.category) {
      category = this.props.complaint.category;
    }
    var officerName = '';
    if (complaint.officer) {
      officerName = complaint.officer.officer_first + ' ' + complaint.officer.officer_last;
      if (complaint.officers.length > 0) {
        officerName += ' and ' + complaint.officers.length + ' more';
      }
    }
    if (allegation['incident_date'] && moment(allegation['incident_date']).year() <= 1970) {
      allegation['incident_date'] = false;
    }
    var dateLabel = 'Incident Date';
    var date = allegation['incident_date_only'];
    if (!allegation['incident_date'] && officerAllegation.start_date) {
      date = officerAllegation.start_date;
      dateLabel = 'Investigation Start';
    }
    var finding = this.props.finding ? this.props.finding.replace(/ /,'-').toLowerCase() : 'other';

    var caretClasses = classnames({
      'fa fa-chevron-right': !detailIsShown,
      'fa fa-chevron-down': detailIsShown
    }, 'complaint-row-outcome', finding);

    var rowClassName = classnames('complaint-row', finding, officerAllegation.final_outcome_class);

    var domId = 'allegation-' + officerAllegation.id;
    return (
      <div className={ rowClassName }>
        <div className='row cursor' id={ domId } onClick={ this.toggleComplaint }>
          <div className='col-md-1 col-xs-1 text-center'>
            <i className={ caretClasses }></i>
          </div>
          <div className='col-md-3 col-xs-3'>
            <div className='title'>Misconduct</div>
            { category.category }
          </div>
          <div className='col-md-1 col-xs-1'>
            <div className='title'>CRID</div>
            { allegation.crid }
          </div>
          <div className='col-md-2 col-xs-2'>
            <div className='title'>{ dateLabel }</div>
            { date }
          </div>
          <div className='col-md-3 col-xs-2'>
            <div className='title'>Officer</div>
            { officerName }
          </div>
          <div className='col-md-2 col-xs-3'>
            <RequestButton complaint={ complaint } />
          </div>

        </div>
        { showMore }
      </div>
    );
  },

  componentDidUpdate: function (e) {
    var id = this.props.complaint.allegation.id;
    var kindOfUserInteraction = this.state.show ? 'open' : 'close';
    ga('send', 'event', 'allegation', kindOfUserInteraction, id);
  },

  toggleComplaint: function (e) {
    this.setState({hasShown: true});
    ComplaintListActions.toggleComplaint(this.props.complaint['officer_allegation'].id);
    SessionAPI.updateSessionInfo({'query': { activeComplaints: this.state.activeComplaints}});
  }

}));

module.exports = ComplaintListRow;
