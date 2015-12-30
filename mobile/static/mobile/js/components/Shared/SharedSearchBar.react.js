var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var SuggestionAPI = require('utils/SuggestionAPI');


// This will be removed soon
var SharedSearchBar = React.createClass({
  onClick: function () {

  },

  render: function () {
    return (
      <div className='shared-search-bar animation'>
        <input className='input-text' placeholder='Search officers or complaints' onChange={this.onInputChange} onFocus={this.onFocus}/>
        <span className='icon icon-search' onClick={this.onClick}/>
      </div>
    );
  }
});

module.exports = SharedSearchBar;
