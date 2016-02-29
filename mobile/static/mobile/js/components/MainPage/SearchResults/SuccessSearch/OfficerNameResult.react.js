var React = require('react');
var PropTypes = React.PropTypes;

var AppHistory = require('utils/History');

var OfficerCard = require('components/Shared/OfficerCard.react');
var SuggestionPresenter = require('presenters/SuggestionPresenter');


var OfficerNameResult = React.createClass({
  propTypes: {
    suggestions: PropTypes.array
  },

  _onClick: function (presenter) {
    AppHistory.pushState(null, presenter.url);
  },

  renderOfficerCard: function (suggestion) {
    var presenter = SuggestionPresenter(suggestion);
    return (
      <li className='officer-name-results'>
        <div className='link officer officer-name-result-item' onClick={ this._onClick.bind(this, presenter) }>
          <OfficerCard officerId={ presenter.resourceKey } allegationsCount={ presenter.allegationsCount }
            displayName={ presenter.text }
            description={ presenter.officerDescription }
          />
        </div>
      </li>
    );
  },

  render: function () {
    return (
      <ul className='suggestion-list'>
        { this.props.suggestions.map(this.renderOfficerCard) }
      </ul>
    );
  }
});

module.exports = OfficerNameResult;
