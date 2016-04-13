var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');
var PropTypes = React.PropTypes;

var Base = require('components/Base.react');
var Allegation = require('components/DataToolPage/Allegation.react');
var ComplaintListActions = require('actions/ComplaintList/ComplaintListActions');
var ComplaintListStore = require('stores/ComplaintListStore');
var SessionAPI = require('utils/SessionAPI');

var AllegationPresenterFactory = require('presenters/AllegationPresenterFactory');


var InvestigationListRow = React.createClass(_.assign(Base(ComplaintListStore), {
  propTypes: {
    complaint: PropTypes.object.isRequired
  },

  componentDidUpdate: function (e) {
    var id = this.props.complaint.allegation.id;
    var kindOfUserInteraction = this.state.show ? 'open' : 'close';
    ga('send', 'event', 'allegation', kindOfUserInteraction, id);
  },

  detailRendered: function () {
    return this.state.hasShown || this.detailIsCurrentlyShown();
  },

  detailIsCurrentlyShown: function () {
    return this.state.activeComplaints.indexOf(this.props.complaint['officer_allegation']['id']) > -1;
  },

  renderShowMore: function () {
    var complaint = this.props.complaint;
    var detailIsShown = this.detailIsCurrentlyShown();

    return this.detailRendered() ? (
      <Allegation allegation={ complaint } hide={ !detailIsShown } toggleAllegation={ this.toggleComplaint } />
    ) : null;
  },

  render: function () {
    var complaint = this.props.complaint;
    var presenter = AllegationPresenterFactory.buildPresenter(complaint);
    var detailIsShown = this.detailIsCurrentlyShown();

    var caretClasses = classnames('fa complaint-row-outcome', presenter.slugifyFinding, {
      'fa-chevron-right': !detailIsShown,
      'fa-chevron-down': detailIsShown
    });

    var rowClassName = classnames('complaint-row', presenter.slugifyFinding, presenter.finalOutcomeClass);

    return (
      <div className={ rowClassName }>
        <div className='row cursor' id={ presenter.domId } onClick={ this.toggleComplaint }>
          <div className='col-md-1 col-xs-1 text-center'>
            <i className={ caretClasses }></i>
          </div>
          <div className='col-md-3 col-xs-3'>
            <div className='title'>Complaints</div>
            { presenter.subCategory }
          </div>
          <div className='col-md-1 col-xs-1'>
            <div className='title'>CRID</div>
            { presenter.crid }
          </div>
          <div className='col-md-2 col-xs-2'>
            <div className='title'>Incident Date</div>
            { presenter.incidentDate }
          </div>
          <div className='col-md-3 col-xs-2'>
            <div className='title'>Complaining Witness</div>
            { presenter.complainingWitness }
          </div>
          <div className='col-md-2 col-xs-3'>
            <div className='title'>Document</div>
            { presenter.documentTypes }
          </div>
        </div>
        { this.renderShowMore() }
      </div>
    );
  },

  toggleComplaint: function (e) {
    this.setState({hasShown: true});
    ComplaintListActions.toggleComplaint(this.props.complaint['officer_allegation']['id']);
    SessionAPI.updateSessionInfo({ query: { activeComplaints: this.state.activeComplaints }});
  }
}));

module.exports = InvestigationListRow;
