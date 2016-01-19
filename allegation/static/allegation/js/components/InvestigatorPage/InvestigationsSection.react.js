var _ = require('lodash');
var React = require('react');

var Base = require('components/Base.react');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var ComplaintListStore = require('stores/ComplaintListStore');
var Counter = require('components/DataToolPage/Counter.react');
var InvestigationList = require('components/InvestigatorPage/InvestigationList.react');
var OutcomeFilter = require('components/DataToolPage/ComplaintList/OutcomeFilter.react');
var OutcomeFilterActions = require('actions/ComplaintList/OutcomeFilterActions');
var RequestModal = require('components/DataToolPage/Complaint/RequestModal.react');


var InvestigationsSection = React.createClass(_.assign(Base(ComplaintListStore), {
  componentDidMount: function () {
    ComplaintListStore.addChangeListener(this._onChange);
    var investigator = this.props.investigator.id || '';
    ComplaintListAPI.getAllForInvestigator(investigator);
  },

  componentWillUnmount: function () {
    ComplaintListStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function (newProps) {
    var investigator = newProps.investigator.id || '';
    ComplaintListAPI.getAllForInvestigator(investigator);
  },

  setActiveFilter: function(investigatorId, activeFilter) {
    OutcomeFilterActions.setActiveFilterInvestigator(investigatorId, activeFilter);
  },

  render: function () {
    return (
      <div className="complaint-list">
        <div className='row'>
          <div className='col-md-3'>
            <h3 className="margin-top-0">Investigations (<Counter to={this.state.complaints.length} />)</h3>
          </div>
          <div className='col-md-9 text-right'>
            <OutcomeFilter
              activeFilter={this.state.activeFilter}
              analytics={this.state.analytics}
              setActiveFilter={this.setActiveFilter.bind(this, this.props.investigator.id)}
              />
          </div>
        </div>
        <InvestigationList complaints={this.state.complaints} />
        <RequestModal />
      </div>
    );
  }
}));

module.exports = InvestigationsSection;
