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
    var officerLink = officer.absolute_url;
    return <div className={className} data-state={selection_state}>
      <a className='officer-link' href={officerLink}>

        <div className='officer_name' onClick={this.openOfficerProfile}>
          <strong>
            {this.props.officer.officer_first.toLowerCase()} {officer.officer_last.toLowerCase()}
          </strong>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='thirty-five  unit'>Unit {officer.unit}</div>
            <div className='sixty disciplines'>
              <div>{officer.allegations_count} complaints</div>
              <div>{officer.discipline_count} disciplines</div>
            </div>
          </div>
        </div>
      </a>
      <div onClick={this.onClick} className='checkmark cursor'>
        <i className='fa fa-check'></i>
      </div>
    </div>

  },
  onClick: function () {
    OfficerActions.setActiveOfficer(this.props.officer);
  },


});

module.exports = Officer;
