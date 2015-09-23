var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var SearchStore = require('../../stores/SearchSection/SearchStore');
var SearchResultsAPI = require('../../utils/SearchResultsAPI');
var SearchActions = require('../../actions/SearchSection/SearchActions');

var Search = React.createClass(_.assign(Base(SearchStore), {
  onChange: function (e) {
    var query = e.target.value;
    SearchActions.searchFor(query);
    SearchResultsAPI.get();
  },

  render: function() {
    return (
      <div id='search' className="col-xs-6 text-right">
        <input className="form-control" type="text" placeholder="Search..." onChange={this.onChange} />
      </div>
    );
  }

}));

module.exports = Search;
