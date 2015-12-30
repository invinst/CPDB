var cx = require('classnames');
var React = require('react');
var history = require('utils/History');
var DataTypeUtil = require('utils/DataTypeUtil');
var SuggestionPresenter = require('presenters/SuggestionPresenter');


var OfficerNameSuggestionResult = React.createClass({

  render: function () {
    var officer = this.props.officer;
    var presenter = SuggestionPresenter(officer);

    return (
      <div>
        <li className='table-view-cell'>
          <div className='link' onClick={this._onClick}>
            <span className='highlight'>{presenter.text}&nbsp;</span>
          </div>
        </li>
      </div>
    );
  },

  _onClick: function () {
    var officer = this.props.officer;
    var presenter = SuggestionPresenter(officer);
    history.pushState(null, presenter.url);
  }
});

module.exports = OfficerNameSuggestionResult;
