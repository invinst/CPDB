var React = require('react');


var Wrapper = React.createClass({
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
