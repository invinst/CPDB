var React = require('react');
var PropTypes = React.PropTypes;

var Timeline = require('components/DataToolPage/Complaint/Timeline.react');
var Location = require('components/DataToolPage/Complaint/Location.react');


var TimelineAndLocation = React.createClass({
  propTypes: {
    complaint: PropTypes.object
  },

  getInitialState: function () {
    return {};
  },
  render: function () {
    var complaint = this.props.complaint;
    var allegation = complaint.allegation;
    var wrapperClassName;
    var row = [];

    if (allegation.start_date || allegation.incident_date || allegation.end_date) {
      row.push(<Timeline key='timeline' className='col-md-offset-1' complaint={ complaint } />);
    }

    if (allegation.point.lat) {
      var className = row.length == 0 ? 'col-md-offset-1' : '';
      row.push(<Location key='location' complaint={ complaint } className={ className } />);
    }

    // don't try to set className for Timeline here since it will trigger a warning
    wrapperClassName = row.length ? 'row' : 'hidden';

    return (
      <div className={ wrapperClassName }>
        { row }
      </div>
    );
  }
});

module.exports = TimelineAndLocation;
