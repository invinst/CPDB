var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var OfficerMixin = require("./OfficerMixin.react");

var Officer = React.createClass({
  mixins: [OfficerMixin],

  getInitialState: function () {
    return {
      'selected': false
    }
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
    var className = 'officer ' + this.getAvgClass();

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
    var officerId = 'officer_' + officer.id;

    var charactersToDisplay = 20;
    var displayName = officer.officer_first.toLowerCase() + " " + officer.officer_last.toLowerCase();
    if(displayName.length > charactersToDisplay){
      displayName = officer.officer_first.toLowerCase().substr(0, 1) + ". " + officer.officer_last.toLowerCase();
    }

    var race = officer.race || 'Race N/A';
    var gender = officer.gender || 'Gender N/A';
    var gender = gender.replace('M', 'Male').replace('F', 'Female');


    return (
      <div className={className} data-state={selection_state} id={officerId} onMouseDown={this.onMouseDown}
           onMouseUp={this.onMouseUp}>
        <a className='officer-link' href={officerLink}>
          <div className='officer_name'>
            <strong>
              {displayName}
            </strong>
          </div>
          <div className='race-gender'>
            {race}, {gender}
          </div>
          <div className='complaint-discipline-row'>
            <div className='row'>
              <div className='col-md-6'>
                <div className=''>
                  complaints
                </div>
                <div className=''>
                  {officer.allegations_count}
                </div>
              </div>
              <div className='vertical-line'></div>
              <div className='col-md-6'>
                <div className=''>
                  disciplines
                </div>
                <div className=''>
                  {officer.discipline_count}
                </div>
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
