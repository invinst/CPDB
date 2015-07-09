var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var Officer = require("./Officer.react");
var OfficerStore = require("../stores/OfficerStore");


var VIEW_PORT_COUNT = 6;
var OFFICER_PER_COL = 2;
var OFFICER_PER_PAGE = VIEW_PORT_COUNT * OFFICER_PER_COL;
var OFFICER_PER_DISPLAY = OFFICER_PER_PAGE * 3;

var OLD_DISPLAY = 0;
var OFFICER_WIDTH = null;


var OfficerList = React.createClass({
  getInitialState: function () {
    return OfficerStore.init();
  },
  componentDidMount: function () {
    OfficerStore.addChangeListener(this._onChange);
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
      $(".officers-container")
        .css('transition', 'none')
        .css('left', 0);
      this.setState({
          current_view: value * OFFICER_PER_COL
      });
  },

  slideToDisplay: function (value) {
    var left = this.getInitDisplay(value * OFFICER_PER_COL);
    $(".officers-container").css('left', left + 'px');
  },

  render: function () {
    var displayCount = OFFICER_PER_DISPLAY;  // 2 time need for view port
    var officers = [];
    var count = 0, i;
    var active = this.state.active_officers.length == 0;
    var display = this.getDisplaying();
    var start = display[0];
    var end = display[1];

    for (i = start; i < end; i++) {
      var officer = this.state.officers[i];
      var selected = this.state.active_officers.indexOf(officer.id) > -1;
      count += 1;

      officers.push(
        <Officer officer={officer} key={i} index={count} active={active} selected={selected} />
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
          <div className="officer-block">
            {officerCol}
            <div className="clearfix"></div>
          </div>
        );
      }
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
            <div className="officer-vertical-scroll">
              <div className="officers-container">
                {officerCols}
                <div className="clearfix"></div>
              </div>
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
    var left = this.getInitDisplay(this.state.current_view);
    if (left) {
      if (OLD_DISPLAY > this.state.current_view) {
        container.css('left', left - OFFICER_WIDTH / 9 + 'px');
      } else {
        container.css('left', left + OFFICER_WIDTH / 9 + 'px');
      }
    }
    OLD_DISPLAY = this.state.current_view;
    setTimeout(function(){
      container
        .css('transition', '0.5s left')
        .css('left', left + 'px');
    }, 10);
  },
  slideHandle: function(e, ui){
    var value = ui.value;
    if (this.isDisplaying(value)) {
      this.slideToDisplay(value)
    } else {
      this.renderNewDisplay(value);
    }
  },
  _onChange: function () {
    this.setState(OfficerStore.getAll());
    var container = $(".officers-container");

    var max = this.state.officers.length - OFFICER_PER_PAGE;
    if (max % OFFICER_PER_COL){
      max = max / OFFICER_PER_COL;
    } else {
      max = parseInt(max / OFFICER_PER_COL) + 1;
    }
    $("#overview-slider").slider({
      min: 0,
      max: max,
      value: 0,
      slide: this.slideHandle,
      start: this.slideHandle
    });
  },
  showMore: function (e) {
    e.preventDefault();
    OfficerActions.setViewMore();
  }

});

module.exports = OfficerList;
