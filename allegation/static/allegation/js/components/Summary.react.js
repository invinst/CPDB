
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var SummaryActions = require('../actions/SummaryActions');
var SummaryRow = require("./SummaryRow.react");
var SummaryChildRow = require("./SummaryChildRow.react");
var SummaryStore = require("../stores/SummaryStore");


var Summary = React.createClass({
  getInitialState: function() {
    return SummaryStore.init();
  },
  componentDidMount: function() {
    SummaryStore.addChangeListener(this._onChange);
    SummaryStore.addSummaryListener(this._changeView)
  },
  render: function(){
    var rows = [];
    var backLink = "";

    if(!this.state.current){

      for(var i=0;i<this.state.rows.length;i++){
        var data = this.state.rows[i];
        rows.push(<SummaryRow data={data} />);
      }
    }
    else{
      for(var i=0;i<this.state.current.subcategories.length;i++){
        var data = this.state.current.subcategories[i];
        rows.push(<SummaryChildRow data={data} />);
      }

      backLink = <a href='#' onClick={this.goBack}>Go Back</a>
    }
    return <div id='summary' className="well">
            <div className='clearfix'>
              <div className='pull-right'>Discipline Taken | Complaints</div>
              <h3 className='pull-left'>Number of Complaints</h3>
            </div>
            <div className="">
            {rows}
            </div>
            {backLink}
          </div>;

  },
  goBack: function(e){
    e.preventDefault()
    SummaryActions.setSummary(false);
  },
  _onChange: function(){
    this.setState(SummaryStore.getAll())

  },
  _changeView: function(){
    this.setState(SummaryStore.getAll())
  }
})

module.exports = Summary