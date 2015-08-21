var React = require('react');
var Icon = require('../Shared/Icon.react')
var NavigationActions = require('../../actions/NavigationActions');


var NavigationItem = React.createClass({
  render: function() {
    var icon = <Icon icon={this.props.icon} />;
    var text = this.props.text || '';
    var active = this.props.active ? 'active' : '';
    return (
        <li onClick={this._onClick} className={active}>
          {icon}
          {text}
        </li>
    )
  },
  _onClick: function() {
    NavigationActions.setActiveItem(this.props.navigation_id)
  }
});

module.exports = NavigationItem;
