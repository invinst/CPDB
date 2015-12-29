var React = require('react');
var cx = require('classnames');

var HelperUtil = require('utils/HelperUtil');


var SearchBar = React.createClass({
  getInitialState: function () {
    return {
      'searchState': 'search'
    }
  },

  onInputChange: function () {
    this.setState({
      'searchState': 'close'
    });
  },

  render: function () {
    var leftIconClassName = cx('icon', HelperUtil.format('icon-{searchState}', {'searchState': this.state.searchState}));

    return (
      <div className='search-bar'>
        <input className='input-text' placeholder='Search officers or complaints' onChange={this.onInputChange}/>
        <span className={leftIconClassName}></span>
      </div>
    );
  }
});

module.exports = SearchBar;
