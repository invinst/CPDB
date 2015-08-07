var HOST = 'http://localhost:8000';
var React = require('react');

var Filters = require('./Filters.react');
var ComplaintListRow = require('./ComplaintListRow.react');
var Download = require('./Download.react');
var OutcomeFilter = require('./ComplaintList/OutcomeFilter.react');
var RequestModal = require('./Complaint/RequestModal.react');

var ComplaintListStore = require('../stores/ComplaintListStore');
var FilterStore = require('../stores/FilterStore');
var OfficerStore = require('../stores/OfficerStore');

var FilterActions = require('../actions/FilterActions');
var OutcomeFilterActions = require('../actions/ComplaintList/OutcomeFilterActions');


var ComplaintList = React.createClass({
  getInitialState: function () {
    var ret = {
      'complaints': []
    };
    if (this.props.allegations) {
      ret = ComplaintListStore.init({
        'complaints': this.props.allegations,
        'officer': this.props.officer
      });
    } else {
      ret = ComplaintListStore.init();
    }
    return ret;
  },
  componentDidMount: function () {
    ComplaintListStore.addChangeListener(this._onChange);
    //var x = 1;
    //var locked = false;
    //var that = this;
    //var currentWindow = $(window);
    //
    //currentWindow.on('scroll',function(){
    //  if (currentWindow.scrollTop()/$(document).height() > .35 && !locked) {
    //    console.log('over half of page');
    //    var qry = FilterStore.getQueryString();
    //
    //    $.get('/api/allegations/?' + qry + "page=" + x + "&length=25", function (data) {
    //      that.setState({'complaints': $.merge(that.state.complaints,data.allegations)});
    //      x++;
    //      locked = false;
    //    }, 'json');
    //    locked = true;
    //  }
    //})
  },
  rowGetter: function (rowIndex) {
    return rows[rowIndex];
  },
  render: function () {
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

    var query = OfficerStore.getQueryString();

    return (
      <div className="complaint_list">
        <div className='row'>
          <div className='col-md-2'>
            <h3 className="margin-top-0">Complaints</h3>
          </div>
          <div className='col-md-10 text-right'>
	          <OutcomeFilter />
          </div>
        </div>
        {rows}
        <div className="row">
          <div className="col-md-2 col-md-offset-10">
            <Download query={query} />
          </div>
        </div>
        <RequestModal />
      </div>
    )
  },
  _onChange: function () {
    this.setState(ComplaintListStore.getAll());

  }
});

module.exports = ComplaintList;
