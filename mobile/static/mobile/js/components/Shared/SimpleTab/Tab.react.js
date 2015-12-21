var cx = require('classnames');
var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var SimpleTab = React.createClass({
  getInitialState: function () {
    return {
      'activeIndex': 0
    }
  },

  componentDidMount: function () {
  },

  setActiveTab: function (index) {
    this.setState({
      'activeIndex': index
    })
  },

  getIndexOfNav: function (parent, nav) {
    for (var i = 0; i < parent.length; i++) {
      if (parent[i] == nav) {
        return i;
      }
    }
    return -1;
  },

  onClick: function (e) {
    var node = e.target;
    var parentChildren = node.parentNode.children;
    var index = this.getIndexOfNav(parentChildren, node);

    if (index != -1) {
      this.setActiveTab(index);
    }
  },

  renderTabNav: function () {
    var navs = this.props.children[0];
    var self = this;

    return navs.props.children.map(function (nav, i) {
      var tabNavRef = 'tabNav-' + i;
      var classNames = cx({
        'active': (i == self.state.activeIndex)
      });


      return React.cloneElement(nav, {
        'ref': tabNavRef,
        className: classNames
      })
    })
  },

  renderTabContent: function () {
    var navs = this.props.children[1];
    var self = this;

    return navs.props.children.map(function (nav, i) {
      var tabNavRef = 'tabContent-' + i;
      var classNames = cx({
        'active': (i == self.state.activeIndex)
      });


      return React.cloneElement(nav, {
        'ref': tabNavRef,
        className: classNames
      })
    })
  },

  render: function () {
    return (
      <div>
        <div className='tab-navs' onClick={this.onClick}>
          {this.renderTabNav()}
        </div>
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          <div className='tab-contents'>
            {this.renderTabContent()}
          </div>
        </ReactCSSTransitionGroup>

      </div>
    )
  }
});

module.exports = SimpleTab;