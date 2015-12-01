var React = require('react');


DEFAULT_MAX_HEIGHT = 300;

var Collapse = React.createClass({
  getInitialState: function () {
    var collapse = !this.props.collapse;
    var maxHeight = this.props.maxHeight || DEFAULT_MAX_HEIGHT;

    return {
      'collapse': collapse,
      'maxHeight': maxHeight
    }
  },

  _action: function () {
    return this.getDOMNode().getElementsByClassName('collapse-action')[0]
  },

  _content: function () {
     return this.getDOMNode().getElementsByClassName('collapse-content')[0];
  },

  _toggleCollapse: function () {
    var content = this._content();

    if (content) {
      var collapse = this.state.collapse;
      var contentMaxHeight = collapse ? 0 : this.state.maxHeight;

      content.style.maxHeight = contentMaxHeight + 'px';

      this.setState({
        'collapse': !collapse
      })
    }
  },

  componentDidMount: function () {
    var toggle = this._action();

    if (toggle) {
      var content = this._content();
      var contentMaxHeight = this.state.collapse ? this.state.maxHeight : 0;

      toggle.addEventListener('click', this._toggleCollapse);
      // set default max-height style for component
      content.style.maxHeight = contentMaxHeight + 'px';
    }
  },

  render: function () {
    return (
      <div className='animation'>
        {this.props.children}
      </div>
    )
  }
});

module.exports = Collapse;
