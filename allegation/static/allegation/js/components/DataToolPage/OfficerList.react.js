var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');
var classnames = require('classnames');

var OfficerActions = require('actions/OfficerActions');
var Officer = require('components/DataToolPage/Officer.react');
var Counter = require('components/DataToolPage/Counter.react');

var OfficerListStore = require('stores/OfficerListStore');

var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var OfficerMixin = require('components/DataToolPage/Officer/OfficerMixin.react');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var VIEW_PORT_COUNT=6,
  OFFICER_PER_COL=2,
  OLD_DISPLAY=0,
  OFFICER_WIDTH=null,
  OFFICER_PER_PAGE=12,
  OFFICER_PER_DISPLAY=36;


var OfficerList = React.createClass({
  propTypes: {
    query: PropTypes.string,
    noClick: PropTypes.func
  },

  mixins: [EmbedMixin, OfficerMixin],

  getInitialState: function () {
    return {
      officers: [],
      activeOfficers: [],
      overview: [],
      currentView: 0,
      embedding: false,
      filtered: false
    };
  },

  componentDidMount: function () {
    this.embedListener();
    OfficerListStore.addChangeListener(this._onChange);

    if (this.props.query != undefined) {
      OfficerListStore.update(this.props.query);
    }
  },
  componentDidUpdate: function () {

    $('.officer-control').disableSelection();

    var officersDiv = $('.officer-vertical-scroll');
    officersDiv
      .off('swipeleft', this.slideToLeft)
      .off('swiperight', this.slideToRight)
      .swipeleft(this.slideToLeft)
      .swiperight(this.slideToRight);

    var container = $('.officers-container');

    var officerBlock = $('.officer-block').slice(1, 2);
    OFFICER_WIDTH = officerBlock.width() + parseFloat(officerBlock.css('margin-left')) +
                    parseFloat(officerBlock.css('padding-left')) + parseFloat(officerBlock.css('padding-right'));

    if (OLD_DISPLAY == this.state.currentView) {
      return;
    }
    var left = this.getInitDisplay(this.state.currentView);
    if (left) {
      if (OLD_DISPLAY > this.state.currentView) {
        container.css('left', left - OFFICER_WIDTH + 'px');
      } else {
        container.css('left', left + OFFICER_WIDTH + 'px');
      }
    }
    OLD_DISPLAY = this.state.currentView;
    setTimeout(function () {
      container
        .removeClass('off')
        .css('left', left + 'px');
    }, 10);
  },

  componentWillUnmount: function () {
    this.removeEmbedListener();
    OfficerListStore.removeChangeListener(this._onChange);
  },

  getDisplaying: function () {

    var start = this.state.currentView - OFFICER_PER_PAGE;
    if (start < 0) {
      start = 0;
    }

    var end = start + OFFICER_PER_DISPLAY;

    if (end > this.state.officers.length) {
      end = this.state.officers.length;
    }

    return [start, end];
  },

  // embedding
  getEmbedCode: function () {
    var node = ReactDOM.findDOMNode(this);
    var width = $(node).width();
    var height = $(node).height();
    var src = '/embed/?page=officers&query=' + encodeURIComponent(AllegationFilterTagsQueryBuilder.buildQuery());
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
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

  getInitDisplay: function (view) {
    var display = this.getDisplaying();
    var left = display[0] - view;
    if (left) {
      left = left / OFFICER_PER_COL;  // 2 items in a col
      left = parseInt(left);  // convert to int
      left = OFFICER_WIDTH * left;
    }
    return left;
  },

  _onChange: function () {
    var newState = OfficerListStore.getAll();
    if (newState.officers == this.state.officers) {
      this.setState(newState);
    } else {
      newState.currentView = 0;
      this.setState(newState);
      this.initSlider();
      this.updateQuickView(0);
    }
    this.updateSliderSize();
  },

  calculateConstants: function () {
    var width = $('#officer-cards').width();
    if (width <= 320) {
      VIEW_PORT_COUNT = 2;
    } else {
      VIEW_PORT_COUNT = parseInt(width / 200);
    }

    OFFICER_PER_PAGE = VIEW_PORT_COUNT * OFFICER_PER_COL;
    OFFICER_PER_DISPLAY = OFFICER_PER_PAGE * 3;
  },

  display: function (value) {
    if (this.isDisplaying(value)) {
      this.slideToDisplay(value);
    } else {
      this.renderNewDisplay(value);
    }
  },

  enterEmbedMode: function () {
    var node = ReactDOM.findDOMNode(this);
    var parent = $(node).parent();
    $(parent).prepend(this.getEmbedNode());
    this.setState({
      embedding: true
    });
  },

  initSlider: function () {
    var max = this.state.officers.length - OFFICER_PER_PAGE;
    if (max % OFFICER_PER_COL) {
      max = parseInt(max / OFFICER_PER_COL) + 1;
    } else {
      max = max / OFFICER_PER_COL;
    }

    var overview = $('.overview-container');
    var controller = $('.officer-control, .officer-horizontal-scroll-control');
    if (max <= 0) {
      overview.hide();
      controller.addClass('off');
    } else {
      controller.removeClass('off');
      overview.show();
      $('#overview-slider').slider({
        min: 0,
        max: max,
        value: 0,
        slide: this.slideHandle,
        start: this.slideHandle
      });
    }
  },

  isDisplaying: function (value) {
    var display = this.getDisplaying();
    return value >= display[0]/OFFICER_PER_COL && value < display[1]/OFFICER_PER_COL - OFFICER_PER_PAGE/OFFICER_PER_COL;
  },

  leaveEmbedMode: function () {
    this.removeEmbedNode();
    this.setState({
      embedding: false
    });
  },

  pecent: function (a, b) {
    return (a / b) * 100;
  },

  prevent: function (e) {
    e.preventDefault();
  },

  removeEmbedNode: function () {
    this.getEmbedNode().remove();
    this.embedNode = null;
  },

  showMore: function (e) {
    e.preventDefault();
    OfficerActions.setViewMore();
  },

  slideHandle: function (e, ui) {
    var value = ui.value;
    this.display(value);
  },

  slideToDisplay: function (value) {
    var start = value * OFFICER_PER_COL;
    var left = this.getInitDisplay(start);
    $('.officers-container').css('left', left + 'px');
    this.updateQuickView(start);
  },

  // end embedding

  slideToLeft: function (e) {
    if (e) {
      e.preventDefault();
    }
    var slider = $('#overview-slider');
    var value = slider.slider('value');
    value = value + 1;
    if (value > slider.slider('option', 'max')) {
      return;
    }
    slider.slider('value', value);
    this.display(value);
  },

  slideToRight: function (e) {
    if (e) {
      e.preventDefault();
    }

    var slider = $('#overview-slider');
    var value = slider.slider('value');
    value = value - 1;

    if (value < 0) {
      return;
    }

    slider.slider('value', value);
    this.display(value);
  },

  updateQuickView: function (start) {
    var overview = [0, 0, 0, 0, 0];
    var i;
    var min = Math.min(start + OFFICER_PER_PAGE, this.state.officers.length);
    for (i = start; i < min; i++) {
      overview[this.getAvgLevel(this.state.officers[i])]++;
    }
    var total = overview.reduce(function (a, b) {
      return a + b;
    });
    var summary = '';
    for (i = 0; i < overview.length; i++) {
      summary += '<div class="overview overview-' + i + '" style="width: ' + this.pecent(overview[i], total) +
        '%"></div>';
    }
    $('#overview-slider .ui-slider-handle').html(summary);
  },

  updateSliderSize: function () {
    var slider = $('#overview-slider');
    var handler = slider.find('.ui-slider-handle');
    var fullWidth = slider.parent().width();
    var handlerWidth = OFFICER_PER_PAGE * fullWidth / this.state.officers.length;

    handler.width(handlerWidth);
    handlerWidth = handler.width(); // get real width after css
    handler.css('margin-left', -handlerWidth / 2 - 3 + 'px');
    slider.css('width', 'calc(100% - ' + (handlerWidth + 6) + 'px)');
  },

  renderNewDisplay: function (value) {
    $('.officers-container').addClass('off');
    this.setState({
      currentView: value * OFFICER_PER_COL
    });
    this.slideToDisplay(value);
  },

  renderOfficerList: function () {
    var displayCount = OFFICER_PER_DISPLAY;  // 2 time need for view port
    var officers = [];
    var count = 0, i;

    var active = this.state['active_officers'].length == 0;
    var display = this.getDisplaying();
    var start = display[0];
    var end = display[1];

    var noClick = this.props.noClick || this.state.embedding;
    for (i = start; i < end; i++) {
      var officer = this.state.officers[i];
      var selected = this.state['active_officers'].indexOf(officer.id) > -1;
      count += 1;

      officers.push(
        <Officer officer={ officer } key={ i } index={ count } active={ active } selected={ selected }
          noClick={ noClick } embed={ this.state.embedding } filtered={ this.state.filtered }/>
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
          <div className='officer-block' key={ i }>
            { officerCol }
            <div className='clearfix'></div>
          </div>
        );
        officerCol = null;
      }
    }
    if (officerCol) {
      officerCols.push(
        <div className='officer-block' key={ i }>
          { officerCol }
          <div className='clearfix'></div>
        </div>
      );
    }

    return officerCols;
  },

  renderOfficerSection: function () {
    if (!this.state.officers.length) {
      return (<div>No officers match the query.</div>);
    }

    var sliderClassName = classnames('col-md-12', 'overview-container', {
      'filtered': this.state.filtered
    });

    return (
      <div>
        <div className='row'>
          <div className={ sliderClassName }>
            <div className='overview-box'>
              { this.renderOverview() }
              <div className='clearfix'></div>
            </div>
            <div id='overview-slider'></div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='officer-control officer-control-left'
              onClick={ this.slideToRight } onDbClick={ this.prevent }>
              <i className='fa fa-angle-left' />
            </div>
            <div className='officer-vertical-scroll'>
              <div className='officers-container'>
                { this.renderOfficerList () }
                <div className='clearfix'></div>
              </div>
            </div>
            <div className='officer-control officer-control-right'
              onClick={ this.slideToLeft } onDbClick={ this.prevent }>
              <i className='fa fa-angle-right' />
            </div>
          </div>
          <div className='col-md-12 officer-horizontal-scroll-control'>
            <button className='btn btn-officer-horizontal-scroll pull-left'
              onClick={ this.slideToRight } onDbClick={ this.prevent }>
              <i className='fa fa-angle-left' />
            </button>
            <button className='btn btn-officer-horizontal-scroll pull-right'
              onClick={ this.slideToLeft } onDbClick={ this.prevent }>
              <i className='fa fa-angle-right' />
            </button>
          </div>
        </div>
      </div>
    );
  },

  renderOverview: function () {
    var overview = [];
    var total = 0;
    var i;
    for (i = 0; i < this.state.overview.length; i++) {
      total += this.state.overview[i];
    }
    for (i = 0; i < this.state.overview.length; i++) {
      var className = 'overview overview-' + i;
      var style = {
        width: this.state.overview[i] * 100 / total + '%'
      };
      overview.push(
        <div className={ className } key={ i } style={ style } />
      );
    }
    return overview;
  },

  render: function () {
    return (
      <div id='officer_list'>
        <div className='row'>
          <div className='col-md-12 officer-count'>
            <h3>Officers (<Counter to={ this.state.officers.length } />)</h3>
          </div>
        </div>
        { this.renderOfficerSection() }
      </div>
    );
  }

});

module.exports = OfficerList;
