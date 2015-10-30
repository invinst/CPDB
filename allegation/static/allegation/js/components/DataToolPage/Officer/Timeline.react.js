var React = require('react');
var MapStore = require("stores/MapStore");


var Timeline = React.createClass({
  getInitialState: function () {
    return {}
  },

  getTimelineData: function(officer) {
    var container = this.getDOMNode();
    $(container).html("<i class='fa fa-spin fa-spinner'/>");
    $.getJSON('/officer/timeline/', {'officer': officer.id}, function (data) {
      var timeLineItems = [];
      var items = data.items;
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

      $(container).html("");
      new vis.Timeline(container, timeLineItems, options);
    });
  },

  componentWillReceiveProps: function(newProps) {
    var officer = newProps.officer;
    this.getTimelineData(officer);
  },

  componentDidMount: function () {
    var officer = this.props.officer;
    this.getTimelineData(officer);
  },
  render: function () {
    return <div></div>
  }

});


module.exports = Timeline;
