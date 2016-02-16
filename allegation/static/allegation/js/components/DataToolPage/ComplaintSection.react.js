require('utils/jQuery');
var React = require('react');
var PropTypes = React.PropTypes;
var classnames = require('classnames');
var Infinite = require('react-infinite');

var Counter = require('components/DataToolPage/Counter.react');
var OutcomeFilter = require('components/DataToolPage/ComplaintList/OutcomeFilter.react');
var RequestModal = require('components/DataToolPage/Complaint/RequestModal.react');
var ComplaintListStore = require('stores/ComplaintListStore');
var ComplaintListAPI = require('utils/ComplaintListAPI');
var ComplaintListRow = require('components/DataToolPage/ComplaintListRow.react');
var LoadingPage = require('components/Shared/LoadingPage.react');


var ComplaintSection = React.createClass({
  propTypes: {
    officer: PropTypes.object
  },

  getInitialState: function () {
    return ComplaintListStore.getState();
  },

  componentDidMount: function () {
    ComplaintListStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    ComplaintListStore.removeChangeListener(this._onChange);
  },

  _lastBottom: 0,

  _onChange: function () {
    this.setState(ComplaintListStore.getState());
  },

  elementInfiniteLoad: function () {
    if (this.state.stopHandleInfiniteLoad) {
      return (<div></div>);
    }
    return (
      <div id='loading' className='center'>
        <i className='fa fa-spinner fa-spin fa-2x'></i>
      </div>
    );
  },

  handleInfiniteLoad: function () {
    if (this.state.stopHandleInfiniteLoad) return false;
    ComplaintListAPI.getMoreData(this.state.pageNumber);
  },

  renderComplaints: function (complaints, officer) {
    var rows = [];

    for (var i = 0; i < complaints.length; i++) {
      var complaint = complaints[i];
      var officerAllegation = complaint['officer_allegation'];
      rows.push(
        <ComplaintListRow
          key={ i }
          complaint={ complaint }
          officer={ officer }
          finding={ officerAllegation.final_finding }/>
      );
    }

    return rows;
  },

  render: function () {
    var loading = this.state.loading;
    if (loading) {
      return <LoadingPage />;
    }

    var activeFilter = this.state.activeFilter;
    var analytics = this.state.analytics;
    var items = this.renderComplaints(this.state.complaints, this.props.officer);
    var className = classnames('complaint-list', {
      'hidden': this.state.noQuery
    });

    var complaintList = '';

    if (items.length == 0) {
      complaintList = (
        <div className='no-complaints'>No allegations match the query.</div>
      );
    } else {
      complaintList = (
        <Infinite elementHeight={ 80 }
          preloadBatchSize={ Infinite.containerHeightScaleFactor(2) }
          preloadAdditionalHeight={ 2500 }
          infiniteLoadBeginEdgeOffset={ 100 }
          onInfiniteLoad={ this.handleInfiniteLoad }
          loadingSpinnerDelegate={ this.elementInfiniteLoad() }
          isInfiniteLoading={ this.state.isInfiniteLoading }
          useWindowAsScrollContainer={ true }>
          { items }
        </Infinite>
      );
    }

    return (
      <div className={ className }>
        <div className='row'>
          <div className='col-md-3 complaint-count'>
            <h3 className='margin-top-0'>Complaints <Counter to={ analytics.All } /></h3>
          </div>
          <div className='col-md-9 text-right'>
            <OutcomeFilter
              loading={ loading }
              activeFilter={ activeFilter }
              analytics={ analytics }
              callAPI={ true }/>
          </div>
        </div>
        { complaintList }
        <RequestModal />
      </div>
    );
  }
});

module.exports = ComplaintSection;
