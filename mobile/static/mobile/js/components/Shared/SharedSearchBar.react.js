var React = require('react');

var AppHistory = require('utils/History');

var HelperUtil = require('utils/HelperUtil');
var SuggestionAPI = require('utils/SuggestionAPI');


// This will be removed soon
var SharedSearchBar = React.createClass({
  getInitialState: function () {
    return {
      'term': ''
    }
  },

  onClick: function () {
    var url = HelperUtil.format('/search/{term}', {'term': this.state.term});
    AppHistory.push({
      'pathname': url,
      'state': {
        'isSearchFocused': 1
      }
    });
  },

  onInputChange: function (e) {
    var term =  e.currentTarget.value;
    // FIXME: Fix this setState() by using actions
    this.setState({
      'term': term
    })
  },

  render: function () {
    return (
      <div className='shared-search-bar animation'>
        <input className='input-text' placeholder='Search officers or complaints' onChange={this.onInputChange} />
        <span className='icon icon-search' onClick={this.onClick}/>
      </div>
    );
  }
});

module.exports = SharedSearchBar;
