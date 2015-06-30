var React = require('react');
var MapStore = require("../stores/MapStore");


var Timeline = React.createClass({
  getInitialState: function () {
    return {}
  },
  componentDidMount: function () {
    var officer = this.props.officer;
    var container = this.getDOMNode();

    $.getJSON('/officer/timeline/', {'officer': officer.id}, function (data) {
      var timeLineItems = [];

      var items = data.items;

      for (var i = 0; i < items.length; i++) {
        if (!items[i]) {
          continue;
        }
        var style = 'display: none';
        var start = moment(items[i]);
        if (start == "Invalid date") {
          continue
        }

        var content = '';
        if (i == 0) {
          style = '';
          content = 'Joined force<br /><span>' + start.format('MMM DD, YYYY'); + '</span>';
        }
        timeLineItems.push({
          id: i + 1,
          content: content,
          start: start,
          style: style
        });
      }

      if (!timeLineItems.length) {
        return;
      }

      timeLineItems = new vis.DataSet(timeLineItems);

      // Configuration for the Timeline
      var options = {'moveable': false, 'zoomable': false};

      new vis.Timeline(container, timeLineItems, options);
    });
  },
  render: function () {
    return <div></div>
  }

});


module.exports = Timeline;
