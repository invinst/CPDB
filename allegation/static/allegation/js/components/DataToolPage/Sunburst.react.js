var _ = require('lodash');
var jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Base = require('components/Base.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');

var Breadcrumb = require('components/DataToolPage/Sunburst/Breadcrumb.react');
var Legend = require('components/DataToolPage/Sunburst/Legend.react');
var SunburstActions = require('actions/SunburstActions');
var FilterTagsActions = require('actions/FilterTagsActions');
var SunburstStore = require('stores/SunburstStore');
var SunburstChartD3 = require('utils/d3utils/SunburstChartD3');
var SessionAPI = require('utils/SessionAPI');
var SunburstAPI = require('utils/SunburstAPI');
var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');
var SunburstServerActions = require('actions/DataToolPage/SunburstServerActions');
var SessionStore = require('stores/SessionStore');


var Sunburst = React.createClass(_.assign(Base(SunburstStore), {
  mixins: [EmbedMixin],

  getEmbedCode: function () {
    var node = ReactDOM.findDOMNode(this);
    var width = jQuery(node).width();
    var height = jQuery(node).height();
    var src = '/embed/?page=sunburst&query='
      + encodeURIComponent(AllegationFilterTagsQueryBuilder.buildQuery());
    src += '&state=' + this.stateToString({name: this.state.selected.name});
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },

  initTabs: function () {
    var i, tab;

    if (this.props.tabs) {
      if (this.props.tabs.tabs.length > 0) {
        for (i =0; i < this.props.tabs.tabs.length; i++) {
          tab = this.props.tabs.tabs[i];
          if (tab.drawChart) {
            this.props.tabs.tabs[i] = this;
            /* I am sorry for this code, blame: Bang!!!! */
          }
        }
      }
      else {
        this.props.tabs.tabs.push(this);
      }
    }
  },

  isEmbedding: function () {
    return this.props.tabs && this.props.tabs.embedding;
  },

  componentDidMount: function () {
    SunburstStore.addChangeListener(this._onChange);
    SunburstStore.addDataChangeListener(this._onDataChange);
    SunburstStore.addSelectedChangeListener(this._onSelectedChange);
    SunburstStore.addSunburstZoomedOutListener(this._onZoomedOut);

    this.initTabs();
    SunburstServerActions.initData();
    this.drawSunburst();
  },

  componentWillUnmount: function () {
    SunburstAPI.resetQueryString();

    SunburstStore.removeChangeListener(this._onChange);
    SunburstStore.removeDataChangeListener(this._onDataChange);
    SunburstStore.removeSelectedChangeListener(this._onSelectedChange);
    SunburstStore.removeSunburstZoomedOutListener(this._onZoomedOut);
  },

  _onDataChange: function () {
    this.drawSunburst();
  },

  _onSelectedChange: function () {
    var selected = SunburstStore.getSelected();
    var selectedSunburstArc;

    SunburstChartD3.selectArc(selected);
    selectedSunburstArc = SessionStore.serializeSelectedSunburstArc(selected);
    SessionAPI.updateSessionInfo({'selected_sunburst_arc': selectedSunburstArc});
  },

  _onZoomedOut: function () {
    // Update session in case a parent arc tag is added
    setTimeout(function () {
      FilterTagsActions.saveTags();
    }, 1);
  },

  drawSunburst: function () {
    var selected;

    SunburstChartD3.draw(this.getChartData());

    selected = SunburstStore.getSelected();

    if (selected) {
      SunburstChartD3.selectArc(selected);
    }
  },

  getChartData: function () {
    return {
      data: SunburstStore.getState().data,
      clickHandler: this.clickHandler,
      mouseOverHandler: this.mouseOverHandler,
      mouseLeaveHandler: this.mouseLeaveHandler
    };
  },

  clickHandler: function (d) {
    if (this.isEmbedding()) {
      return;
    }
    SunburstActions.selectArc(d, this.state.selected);
    FilterTagsActions.saveTags();
  },

  mouseOverHandler: function (d) {
    SunburstActions.hoverArc(d);
  },

  mouseLeaveHandler: function (d) {
    SunburstActions.leaveArc();
  },

  render: function () {
    return (
      <div className='clearfix'>
        <div className='col-md-12'>
          <Breadcrumb clickHandler={ this.clickHandler } />
        </div>
        <div className='col-md-5 col-xs-5'>
          <Legend clickHandler={ this.clickHandler } />
        </div>
        <div id='sunburst-chart' className='col-md-7 col-xs-7'>
        </div>
      </div>
    );
  }
}));

module.exports = Sunburst;
