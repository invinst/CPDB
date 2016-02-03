var React = require('react');
var cx = require('classnames');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');

var SuggestionAPI = require('utils/SuggestionAPI');
var SearchBarActions = require('actions/MainPage/SearchBarActions');
var SearchBarStore = require('stores/MainPage/SearchBarStore');


var SearchBar = React.createClass(objectAssign(Base(SearchBarStore), {
  getInitialState: function () {
    return {
      'status': 'blank',
      'term': ''
    };
  },

  _onInputChange: function (event) {
    var term = event.currentTarget.value;
    SearchBarActions.changed(term);
    SuggestionAPI.get(term);
  },

  _onFocus: function () {
    SearchBarActions.focus();
  },

  _onBlur: function () {
    if (!this.state.term) {
      SearchBarActions.blur();
    }
  },

  _onSearchIconClick: function () {
    SearchBarActions.clear();
  },

  componentDidMount: function () {
    var term = this.props.term || '';
    if (term) {
      SuggestionAPI.get(term);
    }
    SearchBarStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SearchBarStore.removeChangeListener(this._onChange);
    SearchBarStore.recycle();
  },

  render: function () {
    var status = this.state.status;
    var iconClassName = cx('icon', {
      'icon-search': status == 'blank',
      'icon-close': status == 'focus'
    });
    return (
      <div className='search-bar animation'>
        <input className='input-text' placeholder='Search officers or complaints'
               onChange={ this._onInputChange }
               onFocus={ this._onFocus }
               value={ this.state.term }
               onBlur={ this._onBlur }/>
        <span className={ iconClassName } onClick={ this._onSearchIconClick }></span>
      </div>
    );
  }
}));

module.exports = SearchBar;
