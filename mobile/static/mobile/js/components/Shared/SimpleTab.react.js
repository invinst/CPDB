var cx = require('classnames');
var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');


var SimpleTab = React.createClass({
  getInitialState: function () {
    return {
      'activeIndex': 0
    }
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

  onTabItemClick: function (e) {
    var node = e.target;
    var parentChildren = node.parentNode.children;
    var index = this.getIndexOfNav(parentChildren, node);

    if (index != -1) {
      this.setActiveTab(index);
    }
  },

  renderTabNav: function () {
    var navs = this.props.children[0];//TODO : fix hard code
    var self = this;

    this.countOfItems = navs.props.children.length;

    return navs.props.children.map(function (nav, i) {
      var tabNavRef = 'tabNav-' + i;
      var classNames = cx({
        'active': (i == self.state.activeIndex)
      });


      return React.cloneElement(nav, {
        'key': tabNavRef,
        'ref': tabNavRef,
        className: classNames
      })
    })
  },

  renderTabContent: function () {
    var navs = this.props.children[1];//TODO : fix hard code
    var self = this;

    return navs.props.children.map(function (nav, i) {
      var tabContentRef = 'tabContent-' + i;
      var classNames = cx('tab-content', {
        'active': (i == self.state.activeIndex)
      });


      return React.cloneElement(nav, {
        'key': tabContentRef,
        'ref': tabContentRef,
        'className': classNames
      })
    })
  },

  renderNavigation: function () {
    var navs = this.props.children[0];//TODO : fix hard code
    var tabs = navs.props.children;

    var totalNumberOfChildren = tabs.length;
    var currentIndex = this.state.activeIndex;
    var nextIndex = (currentIndex + 1) % totalNumberOfChildren;
    var prevIndex = (currentIndex + totalNumberOfChildren - 1) % totalNumberOfChildren;
    var prev = tabs[prevIndex].props.children;
    var next = tabs[nextIndex].props.children;

    return (
      <Wrapper visible={!!this.props.navigation} wrapperClass='tab-navigations'>
        <div className='row'>
          <div className='six columns' onClick={this.setActiveTab.bind(this, prevIndex)}><span className='icon icon-left'></span>{prev}</div>
          <div className='six columns align-right' onClick={this.setActiveTab.bind(this, nextIndex)}>{next}<span className='icon icon-right'></span></div>
        </div>
      </Wrapper>
    )
  },

  render: function () {
    return (
      <div>
        <div className='tab-navs' onClick={this.onTabItemClick}>
          {this.renderTabNav()}
        </div>
        <div className='tab-contents'>
          {this.renderTabContent()}
        </div>
        {this.renderNavigation()}
      </div>
    )
  }
});

module.exports = SimpleTab;