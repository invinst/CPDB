var React = require('react');

var SharedSearchBar = require('components/Shared/SharedSearchBar.react');


var SearchablePage = React.createClass({
  render: function () {
    return (
      <div>
        <SharedSearchBar />
        {this.props.children}
      </div>
    )
  }
});

module.exports = SearchablePage;
