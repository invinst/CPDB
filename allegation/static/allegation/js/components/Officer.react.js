var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var OfficerMixin = require("./OfficerMixin.react");


var Officer = React.createClass({
  mixins: [OfficerMixin],
  getInitialState: function () {
    return {'selected': false}
  },

  componentDidMount: function () {
  },

  onMouseDown: function(e) {
    $(e.currentTarget).addClass('no-box-shadow')
  },

  onMouseUp: function(e) {
    $(e.currentTarget).removeClass('no-box-shadow')
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
      <div className={className} data-state={selection_state} id={officerId} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
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
              <div>{officer.allegations_count} {pluralize('complaint', officer.allegations_count)}</div>
              <div>{officer.discipline_count} {pluralize('discipline', officer.discipline_count)}</div>
              </div>
            </div>
          </div>
        </a>
        {selectableArea}
      </div>
    );

  },
  onClick: function () {
    OfficerActions.setActiveOfficer(this.props.officer);
  }
});

module.exports = Officer;
