/**
 * Exactly the same as ReactCSSTransitionGroup
 * Only difference is it uses StatePropagateCSSTransitionGroupChild
 * instead of ReactCSSTransitionGroupChild
 */

'use strict';

var React = require('react/lib/React');
var assign = require("react/lib/Object.assign");

var ReactTransitionGroup = React.createFactory(
  require('react/lib/ReactTransitionGroup')
);
var StatePropagateCSSTransitionGroupChild = React.createFactory(
  require('./StatePropagateCSSTransitionGroupChild.react')
);

var StatePropagateCSSTransitionGroup = React.createClass({
  displayName: 'ReactCSSTransitionGroup',

  propTypes: {
    transitionName: React.PropTypes.string.isRequired,
    transitionAppear: React.PropTypes.bool,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      transitionAppear: false,
      transitionEnter: true,
      transitionLeave: true
    };
  },

  _wrapChild: function(child) {
    return StatePropagateCSSTransitionGroupChild(
      {
        name: this.props.transitionName,
        appear: this.props.transitionAppear,
        enter: this.props.transitionEnter,
        leave: this.props.transitionLeave
      },
      child
    );
  },

  render: function() {
    return (
      ReactTransitionGroup(
        assign({}, this.props, {childFactory: this._wrapChild})
      )
    );
  }
});

module.exports = StatePropagateCSSTransitionGroup;
