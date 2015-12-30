var React = require('react');

var DataTypeUtil = require('utils/DataTypeUtil');
var SuggestionPresenter = require('presenters/SuggestionPresenter');


var OfficerBadgeSuggestionResult = React.createClass({

  _onClick: function () {
    var officer = this.props.officer;
    var presenter = SuggestionPresenter(officer);
    history.pushState(null, presenter.url);
  },

  render: function () {
    return (
      <div>
        <li className='table-view-cell'>
          <div className='link' onClick={this._onClick}>
            Badge <span className='highlight'>{this.props.query}&nbsp;</span> xx complaints
          </div>
        </li>
      </div>
    );
  }
});

module.exports = OfficerBadgeSuggestionResult;
