var React = require('react');


var SimpleTabContent = React.createClass({
  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
});

module.exports = SimpleTabContent;