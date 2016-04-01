var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var Base = require('components/Base.react');
var ComplaintListActions = require('actions/ComplaintList/ComplaintListActions');
var ComplaintListStore = require('stores/ComplaintListStore');
var SessionAPI = require('utils/SessionAPI');
var Allegation = require('components/DataToolPage/Allegation.react');
var AllegationPresenterFactory = require('presenters/AllegationPresenterFactory');


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
    var presenter = AllegationPresenterFactory.buildPresenter(complaint);
    var caretClasses,
      rowClassName;

    if (this.detailRendered()) {
      showMore = (
        <Allegation
          allegation={ complaint }
          hide={ !detailIsShown }
          toggleAllegation={ this.toggleComplaint } />
      );
    }

    caretClasses = classnames({
      'fa fa-chevron-right': !detailIsShown,
      'fa fa-chevron-down': detailIsShown
    }, 'complaint-row-outcome', presenter.slugifyFinding);

    rowClassName = classnames('complaint-row', presenter.slugifyFinding, presenter.finalOutcomeClass);

    return (
      <div className={ rowClassName }>
        <div className='row cursor' id={ presenter.domId } onClick={ this.toggleComplaint }>
          <div className='col-md-1 col-xs-1 text-center'>
            <i className={ caretClasses }></i>
          </div>
          <div className='col-md-3 col-xs-3'>
            <div className='title'>Misconduct</div>
            { presenter.mainCategory }
          </div>
          <div className='col-md-1 col-xs-1'>
            <div className='title'>CRID</div>
            { presenter.crid }
          </div>
          <div className='col-md-2 col-xs-2'>
            <div className='title'>{ presenter.incidentDateLabel }</div>
            { presenter.incidentDate }
          </div>
          <div className='col-md-3 col-xs-2'>
            <div className='title'>Officer</div>
            { presenter.officerName }
          </div>
          <div className='col-md-2 col-xs-3'>
            <div className='title'>Document</div>
            { presenter.documentTypes }
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
