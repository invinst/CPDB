var HOST = 'http://localhost:8000';
var React = require('react');
var Infinite = require('react-infinite');
var Filters = require('./Filters.react');
var ComplaintListStore = require('../stores/ComplaintListStore');
var ComplaintListRow = require('./ComplaintListRow.react');
var FilterActions = require('../actions/FilterActions');

var UNKNOWN_FINDINGS = ['No data', 'Unfounded', 'No Cooperation', 'No Affidavit', 'Discharged'];
var FILTER_NAMES = {
  'all': 'All',
  'exonerated': 'Exonerated',
  'sustained': 'Sustained',
  'not-sustained': 'Not Sustained',
  'unknown': 'Unknown'
};

function normalizeFinalFinding(finding) {
  if (finding) {
    return finding;
  }
  return 'No data'
}

function isUnknownFinding(finding) {
  finding = normalizeFinalFinding(finding);
  return UNKNOWN_FINDINGS.indexOf(finding) > - 1;
}

function isActiveFilter(activeFilter, finding) {
  if (activeFilter == 'all') return true;

  if (activeFilter ==  'unknown') {
    return isUnknownFinding(finding);
  }

  return (finding == FILTER_NAMES[activeFilter]);
}

var ComplaintList = React.createClass({
  getInitialState: function () {
    var ret = {
      'complaints': []
    };
    if (this.props.allegations) {
      ret = ComplaintListStore.init({
        'complaints': this.props.allegations,
        'officer': this.props.officer,
        'activeFilter': 'all'
      });
    } else {
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
    if (!this.state.complaints.length) {
      return <div></div>;
    }
    var rows = [];
    var officer = null;
    if (this.props.officer) {
      officer = this.props.officer
    }

    var filters = [];
    for (var filter in FILTER_NAMES) {
      var filterClass = "fa fa-circle " + filter;
      var filterIcon = <span><i className={filterClass}></i>{FILTER_NAMES[filter]}</span>;
      var active = "";
      if (filter == this.state.activeFilter) {
        active = "active";
      }
      if (filter == 'all') {
        filterIcon = FILTER_NAMES[filter];
      }
      filters.push(
        <span className={active} onClick={this.setFilter.bind(this, filter)}>{filterIcon}</span>
      )
    }

    for (var i = 0; i < this.state.complaints.length; i++) {
      var complaint = this.state.complaints[i];
      var allegation = complaint.allegation;
      var final_finding = allegation.final_finding;

      if (isActiveFilter(this.state.activeFilter, final_finding)) {
        if (!officer) {
          officer = complaint.officer;
        }
        rows.push(<ComplaintListRow key={i} complaint={complaint} officer={officer} finding={final_finding}/>)
      }
    }

    return (
      <div className="complaint_list">
        <div className='row'>
          <div className='col-md-2'>
            <h3 className="margin-top-0">Complaints</h3>
          </div>
          <div className='col-md-10 text-right filters'>
            {filters}
          </div>
        </div>
        <Infinite containerHeight={500} elementHeight={50}>
          {rows}
        </Infinite>
        <div className='pull-right'><a href='#' className='btn btn-black'>Download Table</a></div>
      </div>
    )
  },
  _onChange: function () {
    this.setState(ComplaintListStore.getAll());
  },
  setFilter: function (filter) {
    FilterActions.setActiveFilter(filter);
  }
});

module.exports = ComplaintList;
