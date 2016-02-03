var React = require('react');
var PropTypes = React.PropTypes;
var Icon = require('../Shared/Icon.react');
var NavigationActions = require('../../actions/NavigationActions');


var NavigationItem = React.createClass({
  propTypes: {
    navigationId: PropTypes.number,
    icon: PropTypes.string,
    text: PropTypes.string,
    active: PropTypes.bool
  },

  _onClick: function () {
    NavigationActions.setActiveItem(this.props.navigationId);
  },
  render: function () {
    var icon = <Icon icon={ this.props.icon } />;
    var text = this.props.text || '';
    var active = this.props.active ? 'active' : '';
    return (
      <li onClick={ this._onClick } className={ active }>
        { icon }
        { text }
      </li>
    );
  }
});

module.exports = NavigationItem;
