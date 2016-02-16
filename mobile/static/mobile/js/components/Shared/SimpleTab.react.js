var cx = require('classnames');
var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var Wrapper = require('components/Shared/Wrapper.react');


var SimpleTab = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    navigation: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      'activeIndex': 0,
      'previousIndex': -1
    };
  },

  setActiveTab: function (index) {
    var previousIndex = this.state.activeIndex;

    this.setState({
      'activeIndex': index,
      'previousIndex': previousIndex
    });
  },

  getIndexOfNav: function (parent, nav) {
    for (var i = 0; i < parent.length; i++) {
      if (parent[i] == nav) {
        return i;
      }
    }
    return -1;
  },

  onTabItemClick: function (e) {
    var node = e.target;
    var parentChildren = node.parentNode.children;
    var index = this.getIndexOfNav(parentChildren, node);

    if (index != -1) {
      this.setActiveTab(index);
    }
  },

  renderChildren: function (prefix, items) {
    var self = this;

    return items.props.children.map(function (item, i) {
      var itemKey = HelperUtil.format('{prefix}-{i}', {'prefix': prefix, 'i': i});
      var classNames = cx(item.props.className, prefix, {
        'active': (i == self.state.activeIndex),
        'no-animation': (self.state.previousIndex == -1),
        'reverse-animation': (i > self.state.previousIndex)
      });

      return React.cloneElement(item, {
        'key': itemKey,
        className: classNames
      });
    });
  },

  renderTabNav: function () {
    var navs = this.props.children[0];
    return this.renderChildren('tab-nav', navs);
  },

  renderTabContent: function () {
    var tabs = this.props.children[1];
    return this.renderChildren('tab-content', tabs);
  },

  renderNavigation: function () {
    var navs = this.props.children[0];
    var tabs = navs.props.children;

    var totalNumberOfChildren = tabs.length;
    var currentIndex = this.state.activeIndex;
    var nextIndex = (currentIndex + 1) % totalNumberOfChildren;
    var prevIndex = (currentIndex + totalNumberOfChildren - 1) % totalNumberOfChildren;
    var prev = tabs[prevIndex].props.children;
    var next = tabs[nextIndex].props.children;

    return (
      <Wrapper visible={ !!this.props.navigation } wrapperClass='tab-navigations'>
        <div className='row'>
          <div className='six columns' onClick={ this.setActiveTab.bind(this, prevIndex) }>
            <span className='icon icon-left'/>
            { prev }
          </div>
          <div className='six columns align-right' onClick={ this.setActiveTab.bind(this, nextIndex) }>
            { next }
            <span className='icon icon-right'/>
          </div>
        </div>
      </Wrapper>
    );
  },

  render: function () {
    return (
      <div>
        <div className='tab-navs' onClick={ this.onTabItemClick }>
          { this.renderTabNav() }
        </div>
        <div className='tab-contents'>
          { this.renderTabContent() }
        </div>
        { this.renderNavigation() }
      </div>
    );
  }
});

module.exports = SimpleTab;
