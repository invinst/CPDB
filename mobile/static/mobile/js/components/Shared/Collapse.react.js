var React = require('react');

DEFAULT_MAX_HEIGHT = 300

var Collapse = React.createClass({
  getInitialState: function () {
    var collapse = this.props.collapse ? false : true;
    console.log(collapse)
    var maxHeight = this.props.maxHeight || DEFAULT_MAX_HEIGHT;

    return {
      'collapse': collapse,
      'maxHeight': maxHeight
    }
  },

   _toggleCollapse: function () {
    var collapse = this.state.collapse;

    // TODO: if we could not find any content
    var content = this.getDOMNode().getElementsByClassName('collapse-content')[0];
    var contentMaxHeight = collapse ?  0 : this.state.maxHeight;
    content.style.maxHeight = contentMaxHeight + 'px';

    this.setState({
      'collapse': !collapse
    })
  },

  componentDidMount: function () {
    // TODO: if we could not find any tooggle
    var toggle = this.getDOMNode().getElementsByClassName('collapse-action')[0];
    toggle.onclick = this._toggleCollapse;

    var content = this.getDOMNode().getElementsByClassName('collapse-content')[0];
    var contentMaxHeight = this.state.collapse ? this.state.maxHeight : 0;

    content.style.maxHeight =  contentMaxHeight + 'px';
  },

  render: function () {
    return (
      <div className='animation'>
          {this.props.children}
      </div>
    )
  },
});

module.exports = Collapse;
