var HOST = 'http://localhost:8000';
var React = require('react');
var $ = require('jquery');

var Filters = require('./Filters.react');
var ComplaintList = require('./ComplaintList.react');
var Download = require('./Download.react');
var OutcomeFilter = require('./ComplaintList/OutcomeFilter.react');
var RequestModal = require('./Complaint/RequestModal.react');
var LoadingComplaintList = require('./ComplaintList/LoadingComplaintList.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var OfficerStore = require('../stores/OfficerStore');

var ComplaintListActions = require('../actions/ComplaintList/ComplaintListActions');


var ComplaintSection = React.createClass({
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

    var query = OfficerStore.getQueryString();

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
        <ComplaintList officer={this.props.officer} complaints={this.state.complaints} />
        <div className="row">
          <div className="col-md-2 col-md-offset-10">
            <Download query={query}/>
          </div>
        </div>
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

module.exports = ComplaintSection;
