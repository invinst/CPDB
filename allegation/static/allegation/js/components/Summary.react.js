
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
      rows = <div>
        <div className="row">
          <div className="col-md-1 main-count"><strong>{this.state.current.total}</strong></div>
          <div className="col-md-11 main-category-name category-name">{this.state.current.name}</div>
        </div>
        <br />
        <div className="row">{rows}</div>
      </div>

      backLink = <div className='margin-top'><a href='#' className="back" onClick={this.goBack}><i className="fa fa-angle-double-left"/> Go Back</a></div>
    }
    return <div id='summary' className="well">
            <div className='row'>
              <div className='col-md-6'>
                <h3 className="margin-top-0">Categories of Complaints</h3>
              </div>
              <div className='col-md-3'>
                <i className="glyphicon glyphicon-stop type discipline-text" />Discipline Taken
              </div>
              <div className='col-md-3'>
                <i className="glyphicon glyphicon-stop type complaint-text" />Complaints
              </div>
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