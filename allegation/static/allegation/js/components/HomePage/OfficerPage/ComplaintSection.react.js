var React = require('react');

var ComplaintSectionStore = require('stores/OfficerPage/ComplaintSectionStore');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var ComplaintList = require('components/HomePage/ComplaintList.react');
var Counter = require("components/HomePage/Counter.react");
var OutcomeFilter = require('components/HomePage/ComplaintList/OutcomeFilter.react');
var RequestModal = require('components/HomePage/Complaint/RequestModal.react');

var ComplaintSection = React.createClass({
  getInitialState: function () {
    return ComplaintSectionStore.getState();
  },

  componentDidMount: function() {
    var officer = this.props.officer.id || '';
    ComplaintListAPI.getAllForOfficer(officer);
    ComplaintSectionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ComplaintSectionStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
        <div className="complaint_list">
        <div className='row'>
          <div className='col-md-2'>
            <h3 className="margin-top-0">Complaints <Counter to={this.state.complaints.length} /></h3>
          </div>
          <div className='col-md-10 text-right'>
            <OutcomeFilter activeFilter={this.state.activeFilter} analytics={this.state.analytics} />
          </div>
        </div>
        <ComplaintList officer={this.props.officer} complaints={this.state.complaints} />
        <RequestModal />
        <div className="row">
          <div className="col-md-2 col-md-offset-10">
          </div>
        </div>
      </div>
    )
  },

  _onChange: function() {
    this.setState(ComplaintSectionStore.getState());
  }
});

module.exports = ComplaintSection;
