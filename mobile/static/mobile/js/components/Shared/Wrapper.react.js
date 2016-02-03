var React = require('react');


var Wrapper = React.createClass({
  propTypes: {
    wrapperClass: React.PropTypes.string,
    visible: React.PropTypes.bool,
    children: React.PropTypes.element
  },

  render: function () {
    if (this.props.visible) {
      return (
        <div className={ this.props.wrapperClass }>
          { this.props.children }
        </div>
      );
    }
    return (<div></div>);
  }
});

module.exports = Wrapper;
