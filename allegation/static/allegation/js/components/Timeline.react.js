var React = require('react');
var MapStore = require("../stores/MapStore");


var dateFormat = 'MMM DD, YYYY';
function formatDate(date) {
  return moment(date).format(dateFormat);
}


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
        var style = 'display: none';
        var start = formatDate(items[i]);
        if(start == "Invalid date"){
          continue
        }

        var content = '';
        if (i == 0) {
          style = '';
          content = 'Joined force<br /><span>' + start + '</span>';
        }
        timeLineItems.push({
          id: i + 1,
          content: content,
          start: start,
          style: style
        });
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
