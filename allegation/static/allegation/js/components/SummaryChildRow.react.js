
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var SummaryActions = require('../actions/SummaryActions');


var SummaryChildRow = React.createClass({
  render: function(){

    return <div className='col-md-6'>
              <div className="row">
                <div className="col-md-2">
                  <strong>{this.props.data.count}</strong>
                </div>
                <div className="col-md-10 category-name">
                  {this.props.data.name}
                </div>
              </div>
            </div>

  },
})

module.exports = SummaryChildRow