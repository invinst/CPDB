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

    var className = 'officer ' + officerComplaintAvgStatus;
    var selection_state = '';
    if (this.props.active) {
      className += " active";
      selection_state = 'selected';
    }
    if (this.props.selected) {
      className += " selected";
      selection_state = 'selected';
    }
    var selectableArea = "";
    if (!this.props.noClick) {
      selectableArea = <div onClick={this.onClick} className='checkmark cursor'>
        <i className='fa fa-check'></i>
      </div>
    }
    var unit = "";
    var disciplineClass = 'sixty disciplines no-border';
    if (officer.unit){
      unit = "Unit " + officer.unit;
      disciplineClass = 'sixty disciplines';
    }

    var officerLink = officer.absolute_url;
    var officerId = 'officer_' + officer.id;

    return (
      <div className={className} data-state={selection_state} id={officerId}>
        <a className='officer-link' href={officerLink}>
          <div className='officer_name' onClick={this.openOfficerProfile}>
            <strong>
              {this.props.officer.officer_first.toLowerCase()} {officer.officer_last.toLowerCase()}
            </strong>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='thirty-five unit'>{unit}</div>
              <div className={disciplineClass}>
                <div>{officer.allegations_count} complaints</div>
                <div>{officer.discipline_count} disciplines</div>
              </div>
            </div>
          </div>
        </a>
        {selectableArea}
      </div>
    )

  },
  onClick: function () {
    OfficerActions.setActiveOfficer(this.props.officer);
  },


});

module.exports = Officer;
