var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var ComplaintListRow = require('./ComplaintListRow.react');
var FilterActions = require('../actions/FilterActions');

var ComplaintList = React.createClass({
  getInitialState: function () {
    var ret = {};
    if (this.props.allegations) {
      ret = ComplaintListStore.init({
        'complaints': this.props.allegations,
        'officer': this.props.officer,
        'activeFilter': 'all'
      })
    }
    else {
      ret = ComplaintListStore.init();
    }
    return ret;
  },
  componentDidMount: function () {
    ComplaintListStore.addChangeListener(this._onChange);
  },
  rowGetter: function (rowIndex) {
    return rows[rowIndex];
  },
  render: function () {
    var rows = [];
    var officer = null;
    if (this.props.officer) {
      officer = this.props.officer
    }


    var filterNames = {
      'all': 'All',
      'disciplined': 'Disciplined',
      'sustained': 'Sustained',
      'not-sustained': 'Not Sustained',
      'open-investigation': 'Open Investigation'
    }
    var filters = [];
    for (var filter in filterNames) {
      var filterClass = "fa fa-circle " + filter;
      var filterIcon = <span><i className={filterClass}></i>{filterNames[filter]}</span>;
      var active = ""
      if (filter == this.state.activeFilter) {
        active = "active";
      }
      if (filter == 'all') {
        filterIcon = filterNames[filter];
      }
      filters.push(
        <span className={active} onClick={this.setFilter.bind(this, filter)}>{filterIcon}</span>
      )
    }
    for (var i = 0; i < this.state.complaints.length; i++) {
      var complaint = this.state.complaints[i];
      if (!officer) {
        officer = complaint.officer;
      }

      var finding = "";
      var allegation = complaint.allegation;
      if (allegation.final_outcome && allegation.final_outcome != 'No Action Taken') {
        finding = 'disciplined';
      }
      else if (allegation.final_finding == 'Sustained') {
        finding = 'sustained';
      }
      else if (allegation.final_finding == 'Not Sustained') {
        finding = 'not-sustained';
      }
      else {
        finding = 'open-investigation';
      }

      if (this.state.activeFilter != 'all' && this.state.activeFilter != finding) {
        continue;
      }

      rows.push(<ComplaintListRow key={i} complaint={complaint} officer={officer} finding={finding}/>)
    }
    return <div className="complaint_list">
      <div className='row'>
        <div className='col-md-2'>
          <h3 className="margin-top-0">Complaints</h3>

        </div>
        <div className='col-md-10 text-right filters'>
          {filters}
        </div>
      </div>
      {rows}
      <div className='pull-right'><a href='#' className='btn btn-primary'>Download Table</a></div>
    </div>
  },

  _onChange: function () {
    this.setState(ComplaintListStore.getAll());
  },
  setFilter: function (filter) {
    FilterActions.setActiveFilter(filter);
  }
});

module.exports = ComplaintList;
