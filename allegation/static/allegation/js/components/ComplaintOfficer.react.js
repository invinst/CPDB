var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerMixin = require("./OfficerMixin.react");


var ComplaintOfficer = React.createClass({
  mixins: [OfficerMixin],
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {

  },
  render: function () {
    var officer = this.props.officer;
    if (!officer) {
      return <div></div>
    }
    var officerComplaintAvgStatus = this.getAvgClass();

    var className = 'officer ' + officerComplaintAvgStatus;
    var selection_state = '';
    if (this.props.active) {
      className += " selected";
      selection_state = 'selected';
    }
    /* fixme: merge with officer.react.js */
    var officerLink = officer.absolute_url;
    var unit = "";
    var disciplineClass = 'sixty disciplines no-border';
    if (officer.unit){
      unit = "Unit "+ officer.unit;
      disciplineClass = 'sixty disciplines';
    }
    return <div className={className} data-state={selection_state}>
      <a className='officer-link' href={officerLink}>
        <div className='officer_name'>
          <strong>
            {this.props.officer.officer_first.toLowerCase()} {officer.officer_last.toLowerCase()}
          </strong>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='thirty-five  unit'>{unit}</div>
            <div className={disciplineClass}>
              <div>{officer.allegations_count} complaints</div>
              <div>{officer.discipline_count} disciplines</div>
            </div>
          </div>
        </div>
      </a>
    </div>

  }
});

module.exports = ComplaintOfficer;
