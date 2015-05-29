
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var Officer = require("./Officer.react");
var OfficerStore = require("../stores/OfficerStore");


var OfficerList = React.createClass({
  getInitialState: function() {
    return OfficerStore.init();
  },
  componentDidMount: function() {
    OfficerStore.addChangeListener(this._onChange);
  },
  render: function(){
    var officers = []
    var counter = 0;
    var showMoreText = this.state.show_more ? "Show Less" : "Show More";
    for(var id in this.state.officers){
      if(counter++ >= 12 && !this.state.show_more){
        break;
      }
      var officer = this.state.officers[id];
      var active = this.state.active_officers.indexOf(officer.id) > -1;
      officers.push(<div className='col-sm-2'><Officer officer={officer} active={active}/></div>)
    }

    // 6 items per row
    officer_rows = []
    current_row = []
    officer_rows.push(current_row);
    counter = 0;
    for(var i = 0; i < officers.length; i++){
      if(counter++ == 6) {
        current_row = [];
        officer_rows.push(current_row);
      }
      current_row.push(officers[i]);
    }

    // prepare output
    officer_output = []
    for(var i = 0; i < officer_rows.length; i++){
      officer_output.push(<div className="row officers">{officer_rows[i]}</div>)
    }

    return <div id="officer_list">
              <div className='row'>
                <div className='col-md-2'>
                  <h3 className="margin-top-0">Officers List</h3>
                </div>
                <div className='col-md-4'>
                  All | Above Avg | Below Complaints | Good Reputation

                </div>
                <div className='col-md-6'>
                  <span className='pull-right'>ALphabetical</span>
                </div>
              </div>
              {officer_output}
              <a className='pull-right' onClick={this.showMore}>{showMoreText}</a>
          </div>

  },
  _onChange: function(){
    console.log('on change')
    this.setState(OfficerStore.getAll());
    console.log(this.state)
  },
  showMore: function(){
    OfficerActions.setViewMore();
  },

})

module.exports = OfficerList