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
    var allegation,
      officerAllegation,
      category,
      officerName,
      dateLabel,
      date,
      finding,
      caretClasses,
      rowClassName,
      domId;

    if (this.detailRendered()) {
      showMore = (
        <Allegation
          allegation={ complaint }
          hide={ !detailIsShown }
          toggleAllegation={ this.toggleComplaint } />
      );
    }

    allegation = complaint.allegation;
    officerAllegation = complaint['officer_allegation'];
    category = {};
    if (this.props.complaint.category) {
      category = this.props.complaint.category;
    }
    officerName = '';
    if (complaint.officer) {
      officerName = complaint.officer.officer_first + ' ' + complaint.officer.officer_last;
      if (complaint.officers.length > 0) {
        officerName += ' and ' + complaint.officers.length + ' more';
      }
    }
    if (allegation['incident_date'] && moment(allegation['incident_date']).year() <= 1970) {
      allegation['incident_date'] = false;
    }
    dateLabel = 'Incident Date';
    date = allegation['incident_date_only'];
    if (!allegation['incident_date'] && officerAllegation.start_date) {
      date = officerAllegation.start_date;
      dateLabel = 'Investigation Start';
    }
    finding = this.props.finding ? this.props.finding.replace(/ /,'-').toLowerCase() : 'other';

    caretClasses = classnames({
      'fa fa-chevron-right': !detailIsShown,
      'fa fa-chevron-down': detailIsShown
    }, 'complaint-row-outcome', finding);

    rowClassName = classnames('complaint-row', finding, officerAllegation.final_outcome_class);

    domId = 'allegation-' + officerAllegation.id;
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
            <RequestButton document={ complaint.documents[0] } />
          </div>

        </div>
        { showMore }
      </div>
    );
  },

  toggleComplaint: function (e) {
    var id = this.props.complaint.allegation.id;
    var kindOfUserInteraction = this.detailIsCurrentlyShown() ? 'close' : 'open';

    ga('send', 'event', 'allegation', kindOfUserInteraction, id);

    this.setState({hasShown: true});
    ComplaintListActions.toggleComplaint(this.props.complaint['officer_allegation'].id);
    SessionAPI.updateSessionInfo({'query': { activeComplaints: this.state.activeComplaints}});
  }

}));

module.exports = ComplaintListRow;
