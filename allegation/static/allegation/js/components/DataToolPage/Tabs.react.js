/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');
var classnames = require('classnames');

var FilterStore = require('stores/FilterStore');
var Sunburst = require('components/DataToolPage/Sunburst.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var Summary = require('components/DataToolPage/Summary.react');
var Map = require('components/DataToolPage/Map.react');
var RaceGenderTab = require('components/DataToolPage/RaceGenderTab.react');

var Tabs = React.createClass({
  mixins: [EmbedMixin],
  tabs: [],
  activeTabIndex: 0,
  embedding: false,

  getInitialState: function () {
    return {};
  },

  // embedding
  activeTab: function (number, e) {
    this.activeTabIndex = number;

    if (this.embedding) {
      $(this.getDOMNode()).parent().find(".embed-code input").val(this.getEmbedCode());
    }

    var target = $(e.target).data('target');
    $(".tab-pane").removeClass('active');
    $(target).addClass('active');
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
  },

  componentWillUnmount: function () {
    this.removeEmbedListener();
    this.tabs = [];
    this.activeTabIndex = 0;
    this.embedding = false;
  },

  renderMapTab: function () {
    if (!this.props.mobile) {
      return;
    }

    return (
      <li role="presentation" className="active">
        <a href='javascript:void(0)' data-target="#map" aria-controls="map" role="tab" className='pointer' data-toggle="tab"
           onClick={this.activeTab.bind(this, 0)}>
          Map
        </a>
      </li>
    );
  },

  renderOutcomesTab: function (outcomeClassName) {
    var label = 'Outcomes';
    return (
      <li role="presentation" className={outcomeClassName}>
        <a href='javascript:void(0)' data-target="#sunburst" aria-controls="sunburst" role="tab" className='pointer' data-toggle="tab"
           onClick={this.activeTab.bind(this, 0)}>
          {label}
        </a>
      </li>
    );
  },

  renderCategoriesTab: function () {
    var label = 'Categories';

    return (
      <li role="presentation">
        <a href='javascript:void(0)' data-target="#categories" aria-controls="profile" role="tab" className='pointer' data-toggle="tab"
           onClick={this.activeTab.bind(this, 1)}>
          {label}
        </a>
      </li>
    );
  },

  renderGenderRaceTab: function () {
    var label = 'Race & Gender';

    return (
      <li role="presentation">
          <a  href="javascript:void(0)" aria-controls='profile' aria-control='race-gender' role='tab' data-target='#race-gender' className='pointer' data-toggle='tab'>
            {label}
          </a>
        </li>
      );
  },

  renderMapContent: function () {
    if (!this.props.mobile) {
      return;
    }

    return (
      <div role="tabpanel" className='tab-pane active' id="map">
        <Map tabs={this} />
      </div>
    );
  },

  render: function () {
    var isActive = {
      'active': !this.props.mobile
    };
    var outcomeClassName = classnames(isActive);

    var outcomeContentClassName = classnames('tab-pane', isActive);
    return (
      <div>
        <ul className="nav nav-tabs" role="tablist">

          { this.renderMapTab() }
          { this.renderOutcomesTab(outcomeClassName) }
          { this.renderCategoriesTab() }
          { this.renderGenderRaceTab() }
        </ul>

        <div className="tab-content">
          { this.renderMapContent() }
          <div role="tabpanel" className={outcomeContentClassName} id="sunburst">
            <Sunburst tabs={this} />
          </div>
          <div role="tabpanel" className="tab-pane" id="categories">
            <Summary tabs={this} />
          </div>
          <div role='tabpanel' className="tab-pane" id='race-gender'>
            <RaceGenderTab />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Tabs;
