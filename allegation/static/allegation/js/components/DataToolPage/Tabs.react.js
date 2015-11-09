/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');
var classnames = require('classnames');
var slugify = require('slugify');
var isMobile = require('ismobilejs');

global.jQuery = require('jquery');

var AppConstants = require('../../constants/AppConstants');
var FilterStore = require('stores/FilterStore');
var SessionStore = require('stores/SessionStore');
var TabsStore = require('stores/DataToolPage/TabsStore');
var Sunburst = require('components/DataToolPage/Sunburst.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var Summary = require('components/DataToolPage/Summary.react');
var Map = require('components/DataToolPage/Map.react');
var RaceGenderTab = require('components/DataToolPage/RaceGenderTab.react');
var TabActions = require('actions/DataToolPage/TabActions');

var Tabs = React.createClass({
  mixins: [EmbedMixin],
  tabs: [],
  activeTabIndex: 0,
  embedding: false,

  getInitialState: function () {
    return {};
  },

  // embedding
  activeTab: function (number, tab, e) {
    this.activeTabIndex = number;

    if (this.embedding) {
      $(this.getDOMNode()).parent().find(".embed-code input").val(this.getEmbedCode());
    }

    var target = $(e.target).data('target');
    $(".tab-pane").removeClass('active');
    $(target).addClass('active');
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

    this.embedNode.find("input").on("click", function (e) {
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
    this.embedding = true;
    var node = this.getDOMNode();
    var parent = $(node).parent();
    $(parent).prepend(this.getEmbedNode());
  },

  leaveEmbedMode: function () {
    this.embedding = false;
    this.removeEmbedNode();
  },
  // end embedding

  componentDidMount: function () {
    this.embedListener();
    TabsStore.addChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(TabsStore.getState());
  },

  componentWillUnmount: function () {
    this.removeEmbedListener();
    TabsStore.removeChangeListener(this._onChange);
    this.tabs = [];
    this.activeTabIndex = 0;
    this.embedding = false;
  },

  renderNavTab: function (label) {
    var target = slugify(label.toLowerCase().replace('&', ''));
    var data_target = '#' + target;
    var tab = target.replace('-', '_')

    if (tab == 'map' && !isMobile.any) {
      return;
    }

    var tabClass = classnames({
      'active': this.state['active_tab'] == target
    });

    return (
      <li role="presentation" className={tabClass}>
          <a  href="javascript:void(0)" aria-controls='profile' aria-control={target} role='tab' data-target={data_target}
            className='pointer' data-toggle='tab' onClick={this.activeTab.bind(this, AppConstants.TABS[tab], target)}>
            {label}
          </a>
        </li>
      );
  },

  renderTabContent: function (id, Component) {
    if (id == 'map' && !isMobile.any) {
      return;
    }

    var tabClass = classnames('tab-pane', {
      'active': this.state['active_tab'] == id || !this.state['active_tab']
    });

    return (
      <div role="tabpanel" className={tabClass} id={id}>
        <Component tabs={this} />
      </div>
    );
  },

  render: function () {
    var isActive = {
      'active': !isMobile.any
    };

    var outcomeClassName = classnames(isActive);

    var outcomeContentClassName = classnames('tab-pane', isActive);
    return (
      <div className="chart-row">
        <ul className="nav nav-tabs" role="tablist">
          { this.renderNavTab('Map') }
          { this.renderNavTab('Outcomes') }
          { this.renderNavTab('Categories') }
          { this.renderNavTab('Race & Gender') }
        </ul>

        <div className="tab-content">
          { this.renderTabContent('map', Map) }
          { this.renderTabContent('outcomes', Sunburst)}
          { this.renderTabContent('categories', Summary)}
          { this.renderTabContent('race-gender', RaceGenderTab)}
        </div>
      </div>
    );
  }
});

module.exports = Tabs;
