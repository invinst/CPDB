
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
  filterByComplaintCount: function(count_start, count_end, e){
    e.preventDefault();
    $(".filter_links a").removeClass("active");
    $(e.target).addClass("active");
    OfficerActions.setComplaintsCount(count_start, count_end);
  },
  render: function(){
    var officers = []
    var counter = 0;
    var showMore = this.state.show_more;
    var showMoreText = showMore ? "Show Less" : "Show More";
    var isFiltering = this.state.complaints_count_start || this.state.complaints_count_end;

    if (isFiltering) {
      showMoreText = '';
      showMore = true;
    }

    for(var id in this.state.officers){
      var officer = this.state.officers[id];

      if(counter++ >= 12 && !showMore){
        break;
      }

      var active = this.state.active_officers.indexOf(officer.id) > -1;
      officers.push(<div className='col-sm-2' key={officer.id}><Officer officer={officer} active={active}/></div>)
    }

    // 6 items per row
    officer_rows = []
    current_row = []
    officer_rows.push(current_row);
    counter = 0;
    for(var i = 0; i < officers.length; i++){
      if(counter++ == 6) {
        counter = 1;
        current_row = [];
        officer_rows.push(current_row);
      }
      current_row.push(officers[i]);
    }

    // prepare output
    officer_output = []
    for(var i = 0; i < officer_rows.length; i++){
      officer_output.push(<div className="row officers" key={i}>{officer_rows[i]}</div>)
    }

    return <div id="officer_list">
              <div className='row'>
                <div className='col-md-2'>
                  <h3 className="margin-top-0">Officers</h3>
                </div>
              </div>
              {officer_output}
              <a className='pull-right' href="#" onClick={this.showMore}>{showMoreText}</a>
          </div>

  },
  _onChange: function(){
    this.setState(OfficerStore.getAll());
  },
  showMore: function(e){
    e.preventDefault();
    OfficerActions.setViewMore();
  },

})

module.exports = OfficerList