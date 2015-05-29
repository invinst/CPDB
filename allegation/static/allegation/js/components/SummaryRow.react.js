
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var SummaryActions = require('../actions/SummaryActions');

function getSummaryRowState(){
  return {
    'rows':[]
  }
}

var SummaryRow = React.createClass({
  getInitialState: function() {
    return getSummaryRowState();
  },
  render: function(){
    var style = {
      width: (this.props.data.count/this.props.data.total * 100) + "%"
    };
    var progressStyle = {
      width: this.props.data.percentToMax + "%"
    };

    return <div className='row'>
              <div className='col-md-5'>
                <div className="progress" style={progressStyle}>
                  <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={style}>
                    <span className="sr-only"></span>
                  </div>
                </div>
              </div>
              <div className='col-md-1'>
                {this.props.data.count}
              </div>
              <div className='col-md-1'>
                {this.props.data.total}
              </div>
              <div className='col-md-5'>
                <a onClickCapture={this.onClick} href='#'>{this.props.data.name}</a>
              </div>
            </div>

  },
  onClick: function(e){
    e.preventDefault()
    SummaryActions.setSummary(this.props.data)
  }
})

module.exports = SummaryRow