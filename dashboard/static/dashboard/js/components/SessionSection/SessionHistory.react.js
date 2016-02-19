var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;

var FilterLogPresenter = require('utils/FilterLogPresenter');
var SuggestionLogPresenter = require('utils/SuggestionLogPresenter');

var SessionHistory = React.createClass({
  propTypes: {
    suggestions: PropTypes.array,
    filters: PropTypes.array
  },

  renderSessionHistory: function (histories) {
    return histories.map(function (x, i) {
      return <li key={ i }>{ x.asHistoryEntry }</li>;
    });
  },

  render: function () {
    var suggestions,
      filterLogs,
      histories;

    suggestions = this.props.suggestions || [];
    suggestions = suggestions.map(SuggestionLogPresenter);

    filterLogs = this.props.filters || [];
    filterLogs = filterLogs.map(FilterLogPresenter);

    histories = filterLogs.concat(suggestions);
    histories = _.sortByOrder(histories, ['unixTime'], ['asc']);

    if (!histories.length) {
      return (
        <div>Fresh session.</div>
      );
    }

    return (
      <ul className='histories'>{ this.renderSessionHistory(histories) }</ul>
    );
  }
});

module.exports = SessionHistory;
