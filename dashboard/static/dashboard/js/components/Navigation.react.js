var React = require('react');
var NavigationItem = require('./Navigation/Item.react');
var NavigationStore = require('../stores/NavigationStore');
var AppConstants = require('../constants/AppConstants');
var _ = require('lodash');


var Navigation = React.createClass({
  getInitialState: function() {
    return NavigationStore.getState();
  },

  componentDidMount: function() {
    NavigationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    NavigationStore.removeChangeListener(this._onChange);
  },

  renderNavigation: function() {
    var currentActiveItem = this.state.activeItem || 0;

    return _.map(AppConstants.NAVIGATION_ITEMS, function(item, i) {
      return <NavigationItem icon={item.icon} active={i == currentActiveItem} text={item.text} navigation_id={i} key={i}/>
    })
  },

  render: function() {
    return (
      <ul className='list-unstyled col-md-12 col-xs-12 navigation'>
        { this.renderNavigation() }
      </ul>
    )
  },

  _onChange: function() {
    this.setState(NavigationStore.getState());
  }
});

module.exports = Navigation;
