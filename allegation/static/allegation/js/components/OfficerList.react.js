var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var Officer = require("./Officer.react");
var OfficerStore = require("../stores/OfficerStore");
var FilterStore = require("../stores/FilterStore");

var EmbedMixin = require('./Embed/Mixin.react');
var OfficerMixin = require('./Officer/OfficerMixin.react');


var VIEW_PORT_COUNT = 6;
var OFFICER_PER_COL = 2;

var OLD_DISPLAY = 0;
var OFFICER_WIDTH = null;

var windowWidth = $(window).width();

if (windowWidth <= 320) {
  VIEW_PORT_COUNT = 2;
} else {
  VIEW_PORT_COUNT = parseInt(windowWidth / 200);
}

var OFFICER_PER_PAGE = VIEW_PORT_COUNT * OFFICER_PER_COL;
var OFFICER_PER_DISPLAY = OFFICER_PER_PAGE * 3;

var DISPLAYING_COUNT = 12;

var OfficerList = React.createClass({
  mixins: [EmbedMixin, OfficerMixin],

  getInitialState: function () {
    return {
      officers: [],
      active_officers: [],
      overview: [],
      current_view: 0,
      embedding: false
    };
  },

  // embedding
  getEmbedCode: function () {
    var node = this.getDOMNode();
    var width = $(node).width();
    var height = $(node).height();
    var src = "/embed/?page=officers&query=" + encodeURIComponent(FilterStore.getQueryString());
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
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
    var node = this.getDOMNode();
    var parent = $(node).parent();
    $(parent).prepend(this.getEmbedNode());
    this.setState({
      embedding: true
    });
  },

  leaveEmbedMode: function () {
    this.removeEmbedNode();
    this.setState({
      embedding: false
    });
  },
  // end embedding

  slideToLeft: function (e) {
    if (e) {
      e.preventDefault();
    }
    var slider = $("#overview-slider");
    var value = slider.slider("value");
    value = value + 1;
    if (value > slider.slider("option", "max")) {
      return;
    }
    slider.slider("value", value);
    this.display(value);
  },

  slideToRight: function (e) {
    if (e) {
      e.preventDefault();
    }

    var slider = $("#overview-slider");
    var value = slider.slider("value");
    value = value - 1;

    if (value < 0) {
      return;
    }

    slider.slider("value", value);
    this.display(value);
  },

  prevent: function (e) {
    e.preventDefault();
  },

  componentDidMount: function () {
    OfficerStore.addChangeListener(this._onChange);
    this.embedListener();

    $(".officer-vertical-scroll").swipeleft(this.slideToLeft);
    $(".officer-vertical-scroll").swiperight(this.slideToRight);

    $(".officer-control").disableSelection();

    if (this.props.query != undefined) {
      OfficerStore.update(this.props.query);
    }
  },

  getDisplaying: function () {

    var start = this.state.current_view - OFFICER_PER_PAGE;
    if (start < 0) {
      start = 0;
    }

    var end = start + OFFICER_PER_DISPLAY;

    if (end > this.state.officers.length) {
      end = this.state.officers.length;
    }

    return [start, end]
  },

  isDisplaying: function (value) {
    var display = this.getDisplaying();
    return value >= display[0]/OFFICER_PER_COL && value < display[1]/OFFICER_PER_COL - OFFICER_PER_PAGE/OFFICER_PER_COL;
  },

  getInitDisplay: function(view){
    var display = this.getDisplaying();
    var left = display[0] - view;
    if (left) {
      left = left / OFFICER_PER_COL;  // 2 items in a col
      left = parseInt(left);  // convert to int
      left = OFFICER_WIDTH * left;
    }
    return left;
  },

  renderNewDisplay: function (value) {
    $(".officers-container").addClass("off");
    this.setState({
      current_view: value * OFFICER_PER_COL
    });
    this.slideToDisplay(value)
  },

  pecent: function (a, b) {
    return (a / b) * 100;
  },

  updateQuickView: function (start) {
    var overview = [0, 0, 0, 0, 0];
    var i;
    for (i = start; i < start + DISPLAYING_COUNT; i++) {
      overview[this.getAvgLevel(this.state.officers[i])]++;
    }
    var total = overview.reduce(function (a, b) {
      return a + b
    });
    var summary = "";
    for (i = 0; i < overview.length; i++) {
      summary += "<div class=\"overview overview-" + i + "\" style=\"width: " + this.pecent(overview[i], total) +
        "%\"></div>";
    }
    $("#overview-slider .ui-slider-handle").html(summary);
  },

  slideToDisplay: function (value) {
    var start = value * OFFICER_PER_COL;
    var left = this.getInitDisplay(start);
    $(".officers-container").css('left', left + 'px');
    this.updateQuickView(start);
  },

  render: function () {
    var displayCount = OFFICER_PER_DISPLAY;  // 2 time need for view port
    var officers = [];
    var count = 0, i;
    var active = this.state.active_officers.length == 0;
    var display = this.getDisplaying();
    var start = display[0];
    var end = display[1];
    var noClick = this.props.noClick || this.state.embedding;

    for (i = start; i < end; i++) {
      var officer = this.state.officers[i];
      var selected = this.state.active_officers.indexOf(officer.id) > -1;
      count += 1;

      officers.push(
        <Officer officer={officer} key={i} index={count} active={active} selected={selected}
                 noClick={noClick} embed={this.state.embedding}/>
      );

      if (count >= displayCount - 1) {
        break;
      }
    }

    var officerCols = [];
    var officerCol = [];
    var officersLength = officers.length;
    var colOfficerCount = 0;
    for (i = 0; i < officersLength; i++) {
      colOfficerCount += 1;
      if (colOfficerCount == 1) {
        officerCol = [];
      }
      officerCol.push(officers[i]);
      if (colOfficerCount == OFFICER_PER_COL) {
        colOfficerCount = 0;
        officerCols.push(
          <div className="officer-block" key={i}>
            {officerCol}
            <div className="clearfix"></div>
          </div>
        );
        officerCol = null;
      }
    }
    if (officerCol) {
      officerCols.push(
        <div className="officer-block" key={i}>
          {officerCol}
          <div className="clearfix"></div>
        </div>
      )
    }

    var overview = [];
    var total = 0;
    for (i = 0; i < this.state.overview.length; i++) {
      total += this.state.overview[i];
    }
    for (i = 0; i < this.state.overview.length; i++) {
      var className = "overview overview-" + i;
      var style = {
        width: this.state.overview[i] * 100 / total + '%'
      };
      overview.push(
        <div className={className} key={i} style={style} />
      );
    }

    return (
      <div id="officer_list">
        <div className='row'>
          <div className='col-md-12'>
            <h3>Officers</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 overview-container">
            <div className="overview-box">
              {overview}
              <div className="clearfix"></div>
            </div>
            <div id="overview-slider"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="officer-control officer-control-left" onClick={this.slideToRight} onDbClick={this.prevent}>
              <i className="fa fa-angle-left" />
            </div>
            <div className="officer-vertical-scroll">
              <div className="officers-container">
                {officerCols}
                <div className="clearfix"></div>
              </div>
            </div>
            <div className="officer-control officer-control-right" onClick={this.slideToLeft} onDbClick={this.prevent}>
              <i className="fa fa-angle-right" />
            </div>
          </div>
        </div>
      </div>
    );
  },

  componentDidUpdate: function(){
    var container = $(".officers-container");

    var officerBlock = $(".officer-block").slice(1, 2);
    OFFICER_WIDTH = officerBlock.width() + parseFloat(officerBlock.css('margin-left')) +
                    parseFloat(officerBlock.css('padding-left')) + parseFloat(officerBlock.css('padding-right'));
    DISPLAYING_COUNT = container.parent().width() / OFFICER_WIDTH * OFFICER_PER_COL;

    if (OLD_DISPLAY == this.state.current_view) {
      return;
    }

    var left = this.getInitDisplay(this.state.current_view);
    if (left) {
      if (OLD_DISPLAY > this.state.current_view) {
        container.css('left', left - OFFICER_WIDTH + 'px');
      } else {
        container.css('left', left + OFFICER_WIDTH + 'px');
      }
    }
    OLD_DISPLAY = this.state.current_view;
    setTimeout(function(){
      container
        .removeClass("off")
        .css('left', left + 'px');
    }, 10);
  },

  display: function(value) {
    if (this.isDisplaying(value)) {
      this.slideToDisplay(value)
    } else {
      this.renderNewDisplay(value);
    }
  },

  slideHandle: function(e, ui){
    var value = ui.value;
    this.display(value);
  },

  initSlider: function () {
    var container = $(".officers-container");
    var max = this.state.officers.length - OFFICER_PER_PAGE;
    if (max % OFFICER_PER_COL){
      max = parseInt(max / OFFICER_PER_COL) + 1;
    } else {
      max = max / OFFICER_PER_COL;
    }

    var overview = $(".overview-container");
    var controller = $(".officer-control");
    if (max <= 1) {
      overview.hide();
      controller.addClass('off');
    } else {
      controller.removeClass('off');
      overview.show();
      $("#overview-slider").slider({
        min: 0,
        max: max,
        value: 0,
        slide: this.slideHandle,
        start: this.slideHandle
      });
    }
  },

  _onChange: function () {
    var newState = OfficerStore.getAll();
    if (newState.officers == this.state.officers) {
      this.setState(newState);
    } else {
      newState.current_view = 0;
      this.setState(newState);
      this.initSlider();
    }
    this.updateQuickView(0);
  },

  showMore: function (e) {
    e.preventDefault();
    OfficerActions.setViewMore();
  }

});

module.exports = OfficerList;
