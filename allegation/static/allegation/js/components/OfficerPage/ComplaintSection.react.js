var _ = require('lodash');
var React = require('react');

var Base = require('components/Base.react');
var ComplaintListStore = require('stores/ComplaintListStore');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var ComplaintList = require('components/OfficerPage/ComplaintList.react');
var Counter = require("components/DataToolPage/Counter.react");
var OutcomeFilter = require('components/DataToolPage/ComplaintList/OutcomeFilter.react');
var OutcomeFilterActions = require('actions/ComplaintList/OutcomeFilterActions');
var RequestModal = require('components/DataToolPage/Complaint/RequestModal.react');

var ComplaintSection = React.createClass(_.assign(Base(ComplaintListStore), {
  componentDidMount: function() {
    var officer = this.props.officer.id || '';
    ComplaintListStore.addChangeListener(this._onChange);
    if (officer) {
      ComplaintListAPI.getAllForOfficer(officer);
    }
  },

  componentWillReceiveProps: function(newProps) {
    var officer = newProps.officer.id || '';
    if (officer) {
      ComplaintListAPI.getAllForOfficer(officer);
    }
  },

  setActiveFilter: function (officerId, activeFilter) {
    OutcomeFilterActions.setActiveFilterOfficer(officerId, activeFilter);
  },

  render: function() {
    return (
        <div className="complaint-list">
        <div className='row'>
          <div className='col-md-2'>
            <h3 className="margin-top-0">Complaints (<Counter to={this.state.complaints.length} />)</h3>
          </div>
          <div className='col-md-10 text-right'>
            <OutcomeFilter
              activeFilter={this.state.activeFilter}
              analytics={this.state.analytics}
              setActiveFilter={this.setActiveFilter.bind(this, this.props.officer.id)}
              />
          </div>
        </div>
        <ComplaintList officer={this.props.officer} complaints={this.state.complaints} />
        <RequestModal />
        <div className="row">
          <div className="col-md-2 col-md-offset-10">
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = ComplaintSection;
