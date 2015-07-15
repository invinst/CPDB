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
    var officerLink = officer.absolute_url;
    return (
      <div className={className} data-state={selection_state}>
        <a className='officer-link' href={officerLink}>
          <div className='officer_name'>
            <strong>
              {this.props.officer.officer_first.toLowerCase()} {officer.officer_last.toLowerCase()}
            </strong>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='thirty-five  unit'>Unit {officer.unit}</div>
              <div className='sixty disciplines'>
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
