/**
 * Created by eastagile on 8/6/15.
 */
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var classnames = require('classnames');
var slugify = require('slugify');
var isMobile = require('ismobilejs');

var Base = require('components/Base.react');
var AppConstants = require('constants/AppConstants');
var TabsStore = require('stores/DataToolPage/TabsStore');
var Sunburst = require('components/DataToolPage/Sunburst.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var Summary = require('components/DataToolPage/Summary.react');
var Map = require('components/DataToolPage/Map.react');
var RaceGenderTab = require('components/DataToolPage/RaceGenderTab.react');
var TabActions = require('actions/DataToolPage/TabActions');

var Tabs = React.createClass(_.assign(Base(TabsStore), {
  mixins: [EmbedMixin],
  tabs: [],
  activeTabIndex: 0,
  embedding: false,

  componentDidMount: function () {
    TabsStore.addChangeListener(this._onChange);
    this.embedListener();
  },

  componentWillUnmount: function () {
    TabsStore.removeChangeListener(this._onChange);
    this.removeEmbedListener();

    this.tabs = [];
    this.activeTabIndex = 0;
    this.embedding = false;
  },

  componentDidUpdate: function () {
    this.activeTabIndex = AppConstants.TABS[this.state.activeTab];
  },

  // embedding
  activeTab: function (number, tab, e) {
    this.activeTabIndex = number;

    if (this.embedding) {
      $(ReactDOM.findDOMNode(this)).parent().find('.embed-code input').val(this.getEmbedCode());
    }

    TabActions.setActiveTab(tab);
  },

  getActiveTab: function () {
    return this.tabs[this.activeTabIndex];
  },

  getEmbedCode: function () {
    return this.getActiveTab().getEmbedCode();
  },

  getEmbedNode: function () {
    this.embedNode = this.embedNode || $('<div class="embed-code"></div>');
    this.embedNode.append('<i class="fa fa-code"></i>');
    this.embedNode.append('<input type="text" value="" readonly="readonly" />');

    this.embedNode.find('input').on('click', function (e) {
      e.preventDefault();
      $(this).select();
    }).val(this.getEmbedCode());
    return this.embedNode;
  },

  removeEmbedNode: function () {
    this.getEmbedNode().remove();
    this.embedNode = null;
  },

  enterEmbedMode: function () {
    var node = ReactDOM.findDOMNode(this);
    var parent = $(node).parent();

    this.embedding = true;
    $(parent).prepend(this.getEmbedNode());
  },

  leaveEmbedMode: function () {
    this.embedding = false;
    this.removeEmbedNode();
  },
  // end embedding

  isActive: function (target) {
    return this.state.activeTab == target || (!this.state.activeTab && target == 'outcomes');
  },

  renderNavTab: function (label) {
    var target = slugify(label.toLowerCase().replace('&', ''));
    var dataTarget = '#' + target;
    var tab = target;
    var tabClass;

    if (tab == 'map' && !isMobile.any) {
      return;
    }

    tabClass = classnames({
      'active': this.isActive(target)
    });

    return (
      <li role='presentation' className={ tabClass }>
        <a href={ dataTarget } aria-control={ target } role='tab' className='pointer' data-toggle='tab'
          onClick={ this.activeTab.bind(this, AppConstants.TABS[tab], target) }>
          { label }
        </a>
      </li>
    );
  },

  renderTabContent: function (id, Component) {
    var tabClass;

    if (id == 'map' && !isMobile.any) {
      return;
    }

    tabClass = classnames('tab-pane', {
      'active': this.isActive(id)
    });

    return (
      <div role='tabpanel' className={ tabClass } id={ id }>
        <Component tabs={ this } />
      </div>
    );
  },

  render: function () {
    return (
      <div className='chart-row'>
        <ul className='nav nav-tabs' role='tablist'>
          { this.renderNavTab('Map') }
          { this.renderNavTab('Outcomes') }
          { this.renderNavTab('Categories') }
          { this.renderNavTab('Race & Gender') }
        </ul>

        <div className='tab-content'>
          { this.renderTabContent('map', Map) }
          { this.renderTabContent('outcomes', Sunburst) }
          { this.renderTabContent('categories', Summary) }
          { this.renderTabContent('race-gender', RaceGenderTab) }
        </div>
      </div>
    );
  }
}));

module.exports = Tabs;
