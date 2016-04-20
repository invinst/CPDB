var React = require('react');

var SimpleEventSystem = require('components/Lib/SimpleEventSystem');


// This component use its own event system, which allow the other component to send message to itself
// Since it used `SimpleEventSystem`, we assumed that there's no event to be dispatched at the same time
var Modal = React.createClass({
  propTypes: {
    'name': React.PropTypes.string,
    'children': React.PropTypes.node
  },

  childContextTypes: {
    modalName: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      'open': 0
    };
  },

  getChildContext: function () {
    return {
      modalName: this.props.name
    };
  },

  componentDidMount: function () {
    Modal.eventSystem.register(this.props.name, this.handleEvent);
  },

  componentWillUnmount: function () {
    Modal.eventSystem.unregister(this.props.name);
  },

  supportedActions: ['open', 'close'],

  handleEvent: function (event) {
    if (this.supportedActions.indexOf(event) > -1) {
      this.setState({
        'open': event == 'open' ? 1 : 0
      });
    }
  },

  render: function () {
    if (this.state.open) {
      return (
        <div>
          { this.props.children }
        </div>
      );
    }

    return (
      <div></div>
    );
  }
});

Modal.eventSystem = SimpleEventSystem();

Modal.dispatch = function (target, event) {
  return function () {
    Modal.eventSystem.dispatch(target, event);
  };
};

module.exports = Modal;
