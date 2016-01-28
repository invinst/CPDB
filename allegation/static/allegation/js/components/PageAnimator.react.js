var React = require('react');


var PageAnimator = React.createClass({
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.transitioning && !this.props.transitioning) {
      this.animatePageScrollToTop();
    }
  },

  animatePageScrollToTop: function () {
    $('html,body').animate({
      scrollTop: 0
    }, 300);
  },

  renderChildren: function () {
    var animator = this;

    return React.cloneElement(this.props.children, {
      transitioning: this.props.transitioning,
    });
  },

  render: function () {
    return (<div className={ this.props.className }>
      { this.renderChildren() }
    </div>);
  },
});

module.exports = PageAnimator;
