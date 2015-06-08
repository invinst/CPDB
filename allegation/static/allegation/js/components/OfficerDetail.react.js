var React = require('react');

var OfficerDetail = React.createClass({
  getInitialState: function() {
     return {}
  },
  componentDidMount: function() {

  },

  render: function(){
    return <div>{this.props.officer.officer_first}</div>
  },

});

module.exports = OfficerDetail
