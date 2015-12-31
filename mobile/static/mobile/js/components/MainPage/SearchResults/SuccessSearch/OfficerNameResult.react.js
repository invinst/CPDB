var React = require('react');

var AppHistory = require('utils/History');

var SuggestionPresenter = require('presenters/SuggestionPresenter');


var OfficerNameResult = React.createClass({
  _onClick: function () {
    var officer = this.props.suggestion;
    var presenter = SuggestionPresenter(officer);

    AppHistory.pushState(null, presenter.url);
  },

  render: function () {
    var officer = this.props.suggestion;
    var presenter = SuggestionPresenter(officer);

    return (
      <div>
        <li className='suggestion-item'>
          <div className='link' onClick={this._onClick}>
            <span className='highlight'>{presenter.text}&nbsp;</span>
          </div>
        </li>
      </div>
    );
  }
});

module.exports = OfficerNameResult;
