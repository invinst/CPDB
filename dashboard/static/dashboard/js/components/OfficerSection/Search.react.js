var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var SearchStore = require('../../stores/OfficerSection/SearchStore');
var SearchActions = require('../../actions/OfficerSection/SearchActions');
var OfficerAPI = require('../../utils/OfficerAPI');

var Search = React.createClass(_.assign(Base(SearchStore), {
  onChange: function (e) {
    var query = e.target.value;
    if (query.length < 2) {
      return;
    }
    SearchActions.search(query);
    OfficerAPI.get();
  },

  render: function () {
    return (
      <input className='form-control search' type='text' placeholder='Search officer' onChange={ this.onChange } />
    );
  }

}));

module.exports = Search;
