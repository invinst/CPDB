var React = require('react');
var PropTypes = React.PropTypes;

var ComplaintListRow = require('components/DataToolPage/ComplaintListRow.react');


var ComplaintList = React.createClass({
  propTypes: {
    complaints: PropTypes.array,
    officer: PropTypes.object
  },

  renderComplaints: function (officer) {
    if (!this.props.complaints.length) {
      return (<div className='no-complaints'>No allegations match the query.</div>);
    }
    var rows = [];

    for (var i = 0; i < this.props.complaints.length; i++) {
      var complaint = this.props.complaints[i];
      var allegation = complaint.allegation;

      rows.push(
        <ComplaintListRow key={ i } complaint={ complaint } officer={ officer }
          finding={ allegation.final_finding }/>
      );
    }

    return rows;
  },

  render: function () {
    var officer = this.props.officer;

    return (
      <div>
        { this.renderComplaints(officer) }
      </div>
    );
  }
});

module.exports = ComplaintList;
