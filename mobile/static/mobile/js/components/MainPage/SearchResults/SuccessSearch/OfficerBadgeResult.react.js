var React = require('react');

var AppHistory = require('utils/History');

var DataTypeUtil = require('utils/DataTypeUtil');
var SuggestionPresenter = require('presenters/SuggestionPresenter');


var OfficerBadgeResult = React.createClass({
  _onClick: function () {
    var officer = this.props.suggestion;
    var presenter = SuggestionPresenter(officer);
    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    return (
      <div>
        <li className='suggestion-item'>
          <div className='link' onClick={this._onClick}>
            Badge <span className='highlight'>{this.props.term}&nbsp;</span> xx complaints
          </div>
        </li>
      </div>
    );
  }
});

module.exports = OfficerBadgeResult;
