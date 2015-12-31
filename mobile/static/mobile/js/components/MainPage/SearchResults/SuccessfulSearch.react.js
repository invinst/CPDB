var React = require('react');

var OfficerBadgeResult = require('components/MainPage/SearchResults/SuccessSearch/OfficerBadgeResult.react');
var OfficerNameResult = require('components/MainPage/SearchResults/SuccessSearch/OfficerNameResult.react');
var ComplaintResult = require('components/MainPage/SearchResults/SuccessSearch/ComplaintResult.react');

var SuggestionPresenter = require('presenters/SuggestionPresenter');
var DataTypeUtil = require('utils/DataTypeUtil');


var SuccessfulSearch = React.createClass({
  getSubComponentFor: function (type) {
    var subComponentMapper = {
      'officer_name': OfficerNameResult,
      'officer_badge': OfficerBadgeResult,
      'allegation_crid': ComplaintResult
    };

    return subComponentMapper[type];
  },

  renderSuggestionItem: function (suggestion) {
    var presenter = SuggestionPresenter(suggestion);
    var term = this.props.term;

    var SubComponent = this.getSubComponentFor(presenter.suggestionType);
    return (
      <SubComponent term={term} suggestion={suggestion} />
    );
  },

  render: function () {
    var suggestions = this.props.suggestions;

    return (
      <div>
        <ul className='suggestion-list'>
          {suggestions.map(this.renderSuggestionItem)}
        </ul>
      </div>
    )
  }
});

module.exports = SuccessfulSearch;
