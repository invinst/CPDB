var _ = require('lodash');
var React = require('react');

var Base = require('../Base.react');
var SessionsAPI = require('utils/SessionsAPI');
var SessionsActions = require('actions/SessionSection/SessionsActions');

var Search = React.createClass({
  onChange: function (e) {
    var query = e.target.value;
    SessionsActions.searchFor(query);
    SessionsAPI.get(query);
  },

  render: function() {
    return (
      <input className="form-control" type="text" placeholder="Search..." onChange={this.onChange} />
    );
  }
});

module.exports = Search;
