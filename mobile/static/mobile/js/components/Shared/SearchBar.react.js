var React = require('react');

var SearchBar = React.createClass({
  onInputChange: function () {
  },

  render: function () {
    return (
      <input className='search-bar' placeholder='Search officers or complaints' onChange={this.onInputChange} />
    );
  }
});

module.exports = SearchBar;
