
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var SummaryActions = require('../actions/SummaryActions');


var SummaryChildRow = React.createClass({
  render: function(){

    return <div className='col-md-6'>
              {this.props.data.count}
              {this.props.data.name}
            </div>

  },
})

module.exports = SummaryChildRow