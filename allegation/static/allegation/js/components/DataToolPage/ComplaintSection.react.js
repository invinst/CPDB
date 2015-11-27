var React = require('react');
require('utils/jQuery');
var classnames = require('classnames');
var Infinite = require('react-infinite');

var Filters = require('components/DataToolPage/Filters.react');
var Download = require('components/DataToolPage/Download.react');
var Counter = require('components/DataToolPage/Counter.react');
var OutcomeFilter = require('components/DataToolPage/ComplaintList/OutcomeFilter.react');
var RequestModal = require('components/DataToolPage/Complaint/RequestModal.react');
var ComplaintListStore = require('stores/ComplaintListStore');
var OfficerListStore = require('stores/OfficerListStore');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var ComplaintListRow = require('components/DataToolPage/ComplaintListRow.react');


var ComplaintSection = React.createClass({
  _lastBottom: 0,

  getInitialState: function () {
    return ComplaintListStore.getState();
  },

  componentDidMount: function () {
    ComplaintListStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    ComplaintListStore.removeChangeListener(this._onChange);
  },

  elementInfiniteLoad: function() {
    if (this.state.stopHandleInfiniteLoad) {
      return (<div></div>);
    }
    return (
      <div id='loading' className='center'>
        <i className="fa fa-spinner fa-spin fa-2x"></i>
      </div>
    );
  },

  renderComplaints: function (complaints, officer) {
    var rows = [];

    for (var i = 0; i < complaints.length; i++) {
      var complaint = complaints[i];
      var allegation = complaint.allegation;
      var key = 'allegation' + allegation.id;
      rows.push(<ComplaintListRow key={key} complaint={complaint} officer={officer} finding={allegation.final_finding}/>)
    }

    return rows;
  },

  handleInfiniteLoad: function() {
    if (this.state.stopHandleInfiniteLoad) return false;
    ComplaintListAPI.getMoreData(this.state.pageNumber);
  },

  render: function () {
    var activeFilter = this.state.activeFilter;
    var analytics = this.state.analytics;
    var loading = this.state.loading;
    var items = this.renderComplaints(this.state.complaints, this.props.officer);
    var className = classnames('complaint_list', {
      'hidden': this.state.noQuery
    });

    var complaintList = '';

    if (items.length == 0) {
      complaintList = (
        <div className='no-complaints'>No allegations match the query.</div>
      );
    } else {
      complaintList = (
        <Infinite elementHeight={80}
            preloadBatchSize={Infinite.containerHeightScaleFactor(2)}
            preloadAdditionalHeight={2500}
            infiniteLoadBeginEdgeOffset={100}
            onInfiniteLoad={this.handleInfiniteLoad}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            useWindowAsScrollContainer>
        {items}
      </Infinite>
      )
    };

    return (
      <div className={className}>
        <div className='row'>
          <div className='col-md-3 complaint-count'>
            <h3 className="margin-top-0">Complaints <Counter to={analytics.All} /></h3>
          </div>
          <div className='col-md-9 text-right'>
            <OutcomeFilter loading={loading} activeFilter={activeFilter} analytics={analytics}/>
          </div>
        </div>
        {complaintList}
        <RequestModal />
      </div>
    )
  },

  _onChange: function () {
    this.setState(ComplaintListStore.getState());
  }
});

module.exports = ComplaintSection;
