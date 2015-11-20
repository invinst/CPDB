var React = require('react');

var AutoComplete = require('components/DataToolPage/AutoComplete.react');
var FilterTags = require('components/DataToolPage/FilterTags.react');
var FilterStore = require('stores/FilterStore');
var MapAPI = require('utils/MapAPI');


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
  componentWillUnmount: function() {
    FilterStore.removeChangeListener(this._onChange);
    FilterStore.removeCreateListener(this._onCreate);
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
    MapAPI.getMarkers();
  }

});


module.exports = Filters;
