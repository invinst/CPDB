var React = require('react');
var Nav = require('components/Shared/Nav.react');

var StoryPage = React.createClass({
  render: function() {
    return (
      <div>
        <Nav />
        This is story page
      </div>
    )
  }
});

module.exports = StoryPage;