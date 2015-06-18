var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var AppConstants = require("../constants/AppConstants");


var Officer = React.createClass({
  getInitialState: function () {
    return {'selected': false}
  },
  componentDidMount: function () {

  },
  render: function () {
    var officer = this.props.officer;
    if (!officer) {
      return <div></div>
    }
    var officerComplaintAvgStatus = 'bellow';
    if (officer.allegations_count > AppConstants.AVG_COMPLAINTS_NUMBER_GREEN) {
      officerComplaintAvgStatus = 'middle';
    }
    if (officer.allegations_count > AppConstants.AVG_COMPLAINTS_NUMBER_YELLOW) {
      officerComplaintAvgStatus = 'above';
    }

    var className = 'well officer ' + officerComplaintAvgStatus;
    var selection_state = '';
    if (this.props.active) {
      className += " selected";
      selection_state = 'selected';
    }
    var officer_link = officer.absolute_url;
    return <div className={className} data-state={selection_state} onClick={this.onClick}>
      <div className='officer_name'>
        <strong>
          {this.props.officer.officer_first.toLowerCase()} {officer.officer_last.toLowerCase()} <a
          href={officer_link}><i className='fa fa-arrow-right'></i></a>
        </strong>
      </div>
      <div>Unit {officer.unit}</div>
      <div>
        <div><strong>{officer.allegations_count}</strong> complaints</div>
        <div><strong>{officer.discipline_count}</strong> disciplines</div>
      </div>
      <div className='checkmark'>
        <i className='fa fa-check'></i>
      </div>
    </div>

  },
  onClick: function () {
    OfficerActions.setActiveOfficer(this.props.officer);
  }

});

module.exports = Officer;
