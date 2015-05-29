
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var Officer = require("./Officer.react");


var Officer = React.createClass({
  getInitialState: function() {
     return {'selected':false}
  },
  componentDidMount: function() {

  },
  render: function(){
    var selection_state = this.props.active ? 'selected' : '';
    return <div className={selection_state} onClick={this.onClick}>
            <div className='bold'>{this.props.officer.officer_first} {this.props.officer.officer_last}</div>
            <div>Unit {this.props.officer.unit} - {this.props.officer.rank} - #{this.props.officer.star}</div>
            <div>{this.props.officer.allegations_count} complaints | {this.props.officer.disciplines} disciplines</div>
           </div>

  },
  onClick: function(){
    OfficerActions.setActiveOfficer(this.props.officer);
  }

});

module.exports = Officer