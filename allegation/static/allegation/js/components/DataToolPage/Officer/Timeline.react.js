var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');
var moment = require('moment');


var Timeline = React.createClass({
  propTypes: {
    data: PropTypes.object
  },

  componentDidMount: function () {
    this.drawTimeline(this.props.data);
  },

  componentDidUpdate: function () {
    this.drawTimeline(this.props.data);
  },

  drawTimeline: function (data) {
    var container = ReactDOM.findDOMNode(this);
    var timeLineItems = [];
    var items = data.items;
    var i,
      style,
      start,
      timeLineItem,
      rangeItem,
      emptyRangeItem,
      options;

    $(container).html('');

    if (!items) {
      return;
    }

    for (i = 0; i < items.length; i++) {
      if (!items[i]) {
        continue;
      }
      style = 'display: none';
      start = moment(items[i]);
      if (start == 'Invalid date') {
        continue;
      }

      if (i == 0) {
        style = '';
      }

      timeLineItem = {
        id: i + 1,
        content: '',
        start: start,
        style: style
      };
      if (i == 0) {
        timeLineItem.style = '';
        timeLineItem.content = 'Joined force<br /><span>' + start.format('MMM DD, YYYY') + '</span>';
        timeLineItems.push(timeLineItem);
        if (items.length >= 1) {
          rangeItem = {
            id: 'range-1',
            content: 'data withheld for this period',
            start: start,
            end: moment(items[i + 1]),
            type: 'background',
            className: 'missing-data'
          };
          timeLineItems.push(rangeItem);
        }

      }
      else {
        timeLineItems.push(timeLineItem);
      }
    }

    if (!timeLineItems.length) {

      emptyRangeItem = {
        id: 'range-1',
        content: 'no data for this officer',
        start: moment('2000-01-01'),
        end: moment(),
        type: 'background',
        className: 'missing-data'
      };
      timeLineItems.push(emptyRangeItem);

    }
    else {
      timeLineItems.push({
        id: 'range-2',
        content: 'data withheld for this period',
        start: moment('2006-01-01'),
        end: moment('2011-01-01'),
        type: 'background',
        className: 'missing-data border'
      });
    }
    timeLineItems = new vis.DataSet(timeLineItems);

    // Configuration for the Timeline
    options = {'moveable': false, 'zoomable': false, height: '260px'};

    new vis.Timeline(container, timeLineItems, options);
  },

  render: function () {
    var wait = '';
    if (this.props.data) {
      wait = (<i className='fa fa-spin fa-spinner'/>);
    }
    return (<div className='timeline'>{ wait }</div>);
  }
});


module.exports = Timeline;
