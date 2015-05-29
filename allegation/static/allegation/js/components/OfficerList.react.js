
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
      officers.push(<div className='col-md-2'><Officer officer={officer} active={active}/></div>)
    }
    return <div>
              <div className='row'>
                <h3 className='col-md-2'>Officers List</h3>
                <div className='col-md-4'>
                  All | Above Avg | Below Complaints | Good Reputation

                </div>
                <div className='col-md-6'>
                  <span className='pull-right'>ALphabetical</span>
                </div>
              </div>
              <div className='row'>
                {officers}
              </div>
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