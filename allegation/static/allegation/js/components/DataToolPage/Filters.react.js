var React = require('react');
var L = require('leaflet');

var AutoComplete = require('components/DataToolPage/AutoComplete.react');
var FilterTags = require('components/DataToolPage/FilterTags.react');
var FilterStore = require('stores/FilterStore');
var MapStore = require('stores/MapStore');
var _ajax_req = null;


function getFilterState() {
  return {
    'filters': FilterStore.getAll()
  }
}


var Filters = React.createClass({
  getInitialState: function () {
    return getFilterState()
  },

  componentDidMount: function () {
    FilterStore.addChangeListener(this._onChange);
    FilterStore.addCreateListener(this._onCreate);
    if (!this.props.doNotAutLoad) {
      this._onChange();
    }
  },

  render: function () {
    return (
      <div className=''>
        <FilterTags />
      </div>
    )
  },

  _onCreate: function () {
    this.setState(getFilterState());
  },
  _onChange: function () {
    this.setState(getFilterState());
    MapStore.update();
  }

});


module.exports = Filters;
