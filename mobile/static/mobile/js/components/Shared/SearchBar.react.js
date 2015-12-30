var React = require('react');
var cx = require('classnames');

var HelperUtil = require('utils/HelperUtil');
var SuggestionAPI = require('utils/SuggestionAPI');


var SearchBar = React.createClass({
  getInitialState: function () {
    return {
      'searchState': 'search'
    }
  },

  onInputChange: function (event) {
    this.setState({
      'searchState': 'close'
    });
    SuggestionAPI.get(event.currentTarget.value);
  },

  render: function () {
    var searchBarIconClassName = cx('icon', HelperUtil.format('icon-{searchState}', {'searchState': this.state.searchState}));

    return (
      <div className='search-bar animation'>
        <input className='input-text' placeholder='Search officers or complaints' onChange={this.onInputChange}/>
        <span className={searchBarIconClassName}></span>
      </div>
    );
  }
});

module.exports = SearchBar;
