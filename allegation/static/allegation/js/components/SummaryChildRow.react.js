
var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var MapStore = require('../stores/MapStore');
var SummaryActions = require('../actions/SummaryActions');


function getChildRowState(){
  return {
    selected: false
  };
}


var SummaryChildRow = React.createClass({
  getInitialState: function(){
    return getChildRowState();
  },
  onClick: function(e){
    e.preventDefault();

    $(e.target).toggleClass('active');
    $('#cpdb-search').tagsinput("remove", this.props.category.tagValue);
    var tagValue = this.props.subcategory.tagValue;
    if(this.state.selected) {
      // normal removal not work
      var items = $('#cpdb-search').tagsinput("items");
      for(var i = 0; i < items.length; i++){
        var item = items[i];
        if(item.value[0] == tagValue.value[0] && item.value[1] == tagValue.value[1]) {
          $('#cpdb-search').tagsinput("remove", item);
          break;
        }
      }
    } else {
      $('#cpdb-search').tagsinput("add", tagValue);
    }

    this.state.selected = !this.state.selected;
  },
  render: function(){
    return <div className='col-md-6'>
              <div className="row">
                <div className="col-md-2">
                  <strong>{this.props.subcategory.count}</strong>
                </div>
                <div className="col-md-10">
                  <a href="#" className="category-name" onClick={this.onClick}>{this.props.subcategory.name}</a>
                </div>
              </div>
            </div>

  },
})

module.exports = SummaryChildRow