var _ = require('lodash');
var ReactDOM = require('react-dom');
var React = require('react');


var Timeline = React.createClass({
  drawTimeline: function (data) {
    var container = ReactDOM.findDOMNode(this);
    $(container).html("");
    var timeLineItems = [];
    var items = data.items;

    if (!items) {
      return;
    }

    for (var i = 0; i < items.length; i++) {
      if (!items[i]) {
        continue;
      }
      var style = 'display: none';
      var start = moment(items[i]);
      if(start == "Invalid date"){
        continue
      }

      var content = '';
      if (i == 0) {
        style = '';
        content = 'Joined force<br /><span>' + start.format('MMM DD, YYYY'); + '</span>';
      }

      var timeLineItem = {
        id: i + 1,
        content: "",
        start: start,
        style: style
      };
      if (i == 0) {
        timeLineItem.style = '';
        timeLineItem.content = 'Joined force<br /><span>' + start.format('MMM DD, YYYY') + '</span>';
        timeLineItems.push(timeLineItem);
        if(items.length >= 1) {
          var rangeItem = {
            id: "range-1",
            content: "data withheld for this period",
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

        var rangeItem = {
          id: "range-1",
          content: "no data for this officer",
          start: moment("2000-01-01"),
          end: moment(),
          type: 'background',
          className: 'missing-data'
        };
        timeLineItems.push(rangeItem);

    }
    else {
      timeLineItems.push({
        id: "range-2",
        content: "data withheld for this period",
        start: moment("2006-01-01"),
        end: moment("2011-01-01"),
        type: 'background',
        className: 'missing-data border'
      });
    }
    timeLineItems = new vis.DataSet(timeLineItems);

    // Configuration for the Timeline
    var options = {'moveable': false, 'zoomable': false, height: '260px'};

    new vis.Timeline(container, timeLineItems, options);
  },

  componentDidUpdate: function () {
    this.drawTimeline(this.props.data);
  },

  componentDidMount: function () {
    this.drawTimeline(this.props.data);
  },

  render: function () {
    var wait = '';
    if (this.props.data) {
      wait = (<i className='fa fa-spin fa-spinner'/>);
    }
    return (<div className="timeline">{wait}</div>);
  }
});


module.exports = Timeline;
