var classnames = require('classnames');
var React = require('react');

var OverlayStore = require('stores/DataToolPage/OverlayStore');


var Overlay = React.createClass({
  getInitialState: function () {
    return {
      active: false
    };
  },

  componentDidMount: function () {
    OverlayStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    OverlayStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(OverlayStore.getState());
  },

  render: function () {
    var className = classnames({
      'active': this.state.active
    });

    return <div id='overlay' className={ className } />;
  }
});

module.exports = Overlay;
