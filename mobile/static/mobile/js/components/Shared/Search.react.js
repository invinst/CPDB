var _ = require('lodash');
var React = require('react');

var Base = require('components/Base.react');

var SearchActions = require('actions/MainPage/SearchActions');


var Search = React.createClass({

  onFocus: function () {
    SearchActions.activate();
  },

  onBlur: function () {
    SearchActions.deactivate();
  },

  onChange: function (e) {
    var term = e.currentTarget.value;
    SearchActions.searchFor(term)
  },

  render: function () {
    return (
      <span id='search'>
        <input type="search" placeholder="Search"
               onFocus={this.onFocus.bind(this)}
               onBlur={this.onBlur.bind(this)}
               onChange={this.onChange.bind(this)}/>
      </span>
    )
  }
});

module.exports = Search;
