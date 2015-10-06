var HOST = 'http://localhost:8000';
var React = require('react');

var ComplaintListRow = require('components/HomePage/ComplaintListRow.react');


var ComplaintList = React.createClass({
  renderComplaints: function (officer) {
    var rows = [];

    for (var i = 0; i < this.props.complaints.length; i++) {
      var complaint = this.props.complaints[i];
      var allegation = complaint.allegation;

      rows.push(<ComplaintListRow key={i} complaint={complaint} officer={officer} finding={allegation.final_finding}/>)
    }

    return rows;
  },

  render: function () {
    var officer = this.props.officer;

    return (
      <div>
        {this.renderComplaints(officer)}
      </div>
    )
  }
});

module.exports = ComplaintList;
