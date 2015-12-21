var React = require('react');


var SimpleTabNav = React.createClass({
  renderTabChild: function (child) {
    return (
      <li>
        {child}
      </li>
    )
  },

  render: function () {
    return (
      <ul>
        {this.props.children.map(this.renderTabChild)}
      </ul>
    )
  }
});

module.exports = SimpleTabNav;