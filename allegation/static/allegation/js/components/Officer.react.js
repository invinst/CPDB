
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var Officer = require("./Officer.react");
var AppConstants = require("../constants/AppConstants");


var Officer = React.createClass({
  getInitialState: function() {
     return {'selected':false}
  },
  componentDidMount: function() {

  },
  render: function(){
    var officer = this.props.officer;
    if(!officer){
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

    var selection_state = this.props.active ? 'selected' : '';
    return <div className={className} data-state={selection_state} onClick={this.onClick}>
            <div className='officer_name'>
              <strong>
                {this.props.officer.officer_first.toLowerCase()} {officer.officer_last.toLowerCase()}
              </strong>
            </div>
            <div>Unit {officer.unit}</div>
            <div>
              <div><strong>{officer.allegations_count}</strong> complaints</div>
              <div><strong>{officer.discipline_count}</strong> disciplines</div>
            </div>
           </div>

  },
  onClick: function(){
    OfficerActions.setActiveOfficer(this.props.officer);
  }

});

module.exports = Officer