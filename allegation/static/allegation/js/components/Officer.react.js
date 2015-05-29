
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
    return <div className="well officer" data-state={selection_state} onClick={this.onClick}>
            <div className='officer_name'>
              <strong>
                {this.props.officer.officer_first.toLowerCase()} {this.props.officer.officer_last.toLowerCase()}
              </strong>
            </div>
            <div>Unit {this.props.officer.unit}</div>
            <div>
              <strong>{this.props.officer.allegations_count} complaints</strong>
              |
              <strong>10 {this.props.officer.disciplines} disciplines</strong>
            </div>
           </div>

  },
  onClick: function(){
    OfficerActions.setActiveOfficer(this.props.officer);
  }

});

module.exports = Officer