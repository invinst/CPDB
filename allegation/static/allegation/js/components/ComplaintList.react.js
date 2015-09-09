var HOST = 'http://localhost:8000';
var React = require('react');
var $ = require('jquery');

var Filters = require('./Filters.react');
var ComplaintListRow = require('./ComplaintListRow.react');
var Download = require('./Download.react');
var OutcomeFilter = require('./ComplaintList/OutcomeFilter.react');
var RequestModal = require('./Complaint/RequestModal.react');
var LoadingComplaintList = require('./ComplaintList/LoadingComplaintList.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var OfficerStore = require('../stores/OfficerStore');

var ComplaintListActions = require('../actions/ComplaintList/ComplaintListActions');


var ComplaintList = React.createClass({
  getInitialState: function () {
    return ComplaintListStore.getState();
  },

  componentDidMount: function () {
    ComplaintListStore.addChangeListener(this._onChange);
    $(window).on('scroll', this._onScroll);
  },

  rowGetter: function (rowIndex) {
    return rows[rowIndex];
  },

  render: function () {
    var activeFilter = this.state.activeFilter;
    var analytics = this.state.analytics;
    var loading = this.state.loading || false;

    if (loading) {
      return (<LoadingComplaintList />);
    }

    if (!this.state.complaints.length) {
      return <div></div>;
    }

    var rows = [];
    var officer = null;
    if (this.props.officer) {
      officer = this.props.officer
    }

    for (var i = 0; i < this.state.complaints.length; i++) {
      var complaint = this.state.complaints[i];
      var allegation = complaint.allegation;

      rows.push(<ComplaintListRow key={i} complaint={complaint} officer={officer} finding={allegation.final_finding}/>)
    }

    return (
      <div className="complaint_list" onScroll={this.onScroll}>
        <div className='row'>
          <div className='col-md-2'>
            <h3 className="margin-top-0">Complaints</h3>
          </div>
          <div className='col-md-10 text-right'>
            <OutcomeFilter activeFilter={activeFilter} analytics={analytics}/>
          </div>
        </div>
        {rows}
        <RequestModal />
      </div>
    )
  },

  _onChange: function () {
    this.setState(ComplaintListStore.getState());
  },

  _onScroll: function () {
    if ($(window).scrollTop() / $(document).height() > .35 && !this.state.scrollLock) {
      ComplaintListActions.getMoreData(this.state.pageNumber);
      ComplaintListStore.lockScroll();
    }
  },
});

module.exports = ComplaintList;
