var React = require('react');
var cx = require('classnames');
var objectAssign = require('object-assign');

var Base = require('components/Base.react');

var HelperUtil = require('utils/HelperUtil');
var SuggestionAPI = require('utils/SuggestionAPI');
var SearchBarActions = require('actions/MainPage/SearchBarActions');
var SearchBarStore = require('stores/MainPage/SearchBarStore');


var SearchBar = React.createClass(objectAssign(Base(SearchBarStore), {
  getInitialState: function () {
    return {
      'status': 'blank',
      'term': ''
    }
  },

  _onInputChange: function (event) {
    // FIXME: term in Store is not updated?
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
      // call the api
      // TODO: Refactor this
      SuggestionAPI.get(term);
    }
    SearchBarStore.addChangeListener(this._onChange)
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
               onChange={this._onInputChange}
               onFocus={this._onFocus}
               value={this.state.term}
               onBlur={this._onBlur}/>
        <span className={iconClassName} onClick={this._onSearchIconClick}></span>
      </div>
    );
  }
}));

module.exports = SearchBar;
