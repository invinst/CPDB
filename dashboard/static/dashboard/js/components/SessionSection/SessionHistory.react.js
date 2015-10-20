var _ = require('lodash');
var moment = require('moment');
var React = require('react');

var FilterLogPresenter = require('utils/FilterLogPresenter');
var SuggestionLogPresenter = require('utils/SuggestionLogPresenter');

var SessionHistory = React.createClass({
  renderSessionHistory: function(histories) {
     return histories.map(function(x) {
       return <li>{x.asHistoryEntry}</li>;
     })
  },

  render: function() {
    var suggestions = this.props.suggestions || [];
    suggestions = suggestions.map(SuggestionLogPresenter);

    var filter_logs = this.props.filters || [];
    filter_logs = filter_logs.map(FilterLogPresenter);

    var histories = filter_logs.concat(suggestions);
    histories = _.sortByOrder(histories, ['unixTime'], ['asc']);

    return (
      <ul className='histories'>{this.renderSessionHistory(histories)}</ul>
    )
  }
});

module.exports = SessionHistory;