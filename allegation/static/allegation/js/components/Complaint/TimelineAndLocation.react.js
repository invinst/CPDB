var React = require('react');

var Timeline = require('./Timeline.react');
var Location = require('./Location.react');


var TimelineAndLocation = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var complaint = this.props.complaint;
    var allegation = complaint.allegation;

    var row = [];
    if (allegation.start_date || allegation.incident_date || allegation.end_date) {
      row.push(<Timeline complaint={complaint} />);
    }
    if (allegation.point.lat) {
      row.push(<Location complaint={complaint} />);
    }
    var className = "hidden";
    if (row.length) {
      row[0].props.className = "col-md-offset-1";
      className = "row";
    }
    return (
      <div className={className}>
        {row}
      </div>
    );
  }
});

module.exports = TimelineAndLocation;
