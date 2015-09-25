/**
 * Created by eastagile on 8/6/15.
 */
var React = require('react');
var FilterStore = require('stores/FilterStore');
var Sunburst = require('components/HomePage/Sunburst.react');
var EmbedMixin = require('components/HomePage/Embed/Mixin.react');
var Summary = require('components/HomePage/Summary.react');


var Tabs = React.createClass({
  mixins: [EmbedMixin],
  tabs: [],
  activeTabIndex: 0,
  embedding: false,

  getInitialState: function () {
    return {};
  },

  // embedding
  activeTab: function (number) {
    this.activeTabIndex = number;

    if (this.embedding) {
      $(this.getDOMNode()).parent().find(".embed-code input").val(this.getEmbedCode());
    }
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

  render: function () {
    return (
      <div>
        <ul className="nav nav-tabs" role="tablist">
          <li role="presentation" className="active">
            <a href="#sunburst" aria-controls="sunburst" role="tab" data-toggle="tab"
               onClick={this.activeTab.bind(this, 0)}>
              Outcomes
            </a>
          </li>
          <li role="presentation">
            <a href="#categories" aria-controls="profile" role="tab" data-toggle="tab"
               onClick={this.activeTab.bind(this, 1)}>
              Categories
            </a>
          </li>
          <li role="presentation" className="disabled">
            <a href="#" aria-controls="profile" role="tab">
              Race &amp; Gender
            </a>
          </li>
          <li role="presentation" className="disabled">
            <a href="#" aria-controls="profile" role="tab">
              Timeframe
            </a>
          </li>
        </ul>

        <div className="tab-content">
          <div role="tabpanel" className="tab-pane active" id="sunburst">
            <Sunburst tabs={this} />
          </div>
          <div role="tabpanel" className="tab-pane" id="categories">
            <Summary tabs={this} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Tabs;
