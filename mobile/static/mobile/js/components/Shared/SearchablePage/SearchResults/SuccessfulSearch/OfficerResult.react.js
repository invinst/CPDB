var React = require('react');
var cx = require('classnames');

var OfficerCard = require('components/Shared/OfficerCard.react');
var HighlightText = require('components/Shared/HighlightText.react');
var SuggestionPresenter = require('presenters/SuggestionPresenter');
var OfficerPresenter = require('presenters/OfficerPresenter');
var AppHistory = require('utils/History');


var OfficerResult = React.createClass({
  propTypes: {
    term: React.PropTypes.string,
    suggestions: React.PropTypes.array
  },

  _onClick: function (presenter) {
    var officerPresenter = OfficerPresenter(presenter.meta);
    ga('send', 'event', 'filter', presenter.resource, presenter.text);
    AppHistory.pushState(null, officerPresenter.url);
  },

  renderOfficerCard: function (suggestion) {
    var presenter = SuggestionPresenter(suggestion);
    var displayName = (<HighlightText fullText={ presenter.text } textToFind={ this.props.term } />);
    var badgeClassName = cx('badge-value', {'highlight': this.props.term == presenter.meta.badge});
    var officerPresenter = OfficerPresenter(presenter.meta);

    return (
      <li className='officer-name-results outer-glow' key={ presenter.uniqueKey }>
        <div className='link officer officer-name-result-item' onClick={ this._onClick.bind(this, presenter) }>
          <div className='officer-header pad'>
            <span className='officer-label'> Officer<span className='dot-bullet'>&#8226;</span></span>
            <span className='badge-title'>Badge</span>
            <span className={ badgeClassName }>{ officerPresenter.badge }</span>
            <span className='complaint-count'>{ officerPresenter.allegationsCount } complaints</span>
          </div>
          <OfficerCard officerId={ presenter.resourceKey } allegationsCount={ officerPresenter.allegationsCount }
            displayName={ displayName }
            description={ presenter.meta.description }
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

module.exports = OfficerResult;
