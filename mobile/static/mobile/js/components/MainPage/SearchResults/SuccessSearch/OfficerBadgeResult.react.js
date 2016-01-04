var React = require('react');

var pluralize = require('pluralize');

var AppHistory = require('utils/History');

var DataTypeUtil = require('utils/DataTypeUtil');
var SuggestionPresenter = require('presenters/SuggestionPresenter');


var OfficerBadgeResult = React.createClass({
  _onClick: function () {
    var officer = this.props.suggestions[0];
    var presenter = SuggestionPresenter(officer);
    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    var officer = this.props.suggestions[0];
    var presenter = SuggestionPresenter(officer);

    return (
      <ul className='suggestion-list'>
        <li className='officer-badge-results'>
          <div className='link officer-badge-result-item' onClick={this._onClick}>
            Badge no. <span className='highlight'>{this.props.term}&nbsp;</span> {pluralize('complaint', presenter.allegationsCount, true)}
          </div>
        </li>
      </ul>
    );
  }
});

module.exports = OfficerBadgeResult;
