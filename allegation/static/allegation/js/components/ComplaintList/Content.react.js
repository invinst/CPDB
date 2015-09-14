var React = require('react');

var RequestModal = require('../Complaint/RequestModal.react');
var ComplaintListRow = require('../ComplaintListRow.react');

var Content = React.createClass({

  render: function() {
    var loading = this.props.loading;

    if (loading) {
      return (
        <div id='loading' className='center'>
          <i className="fa fa-spinner fa-spin fa-2x"></i>
        </div>
      );
    }
    var rows = [];
    var officer = null;
    if (this.props.officer) {
      officer = this.props.officer
    }

    var complaintLength = this.props.complaints.length;

    for (var i = 0; i < complaintLength; i++) {
      var complaint = this.props.complaints[i];
      var allegation = complaint.allegation;

      rows.push(<ComplaintListRow key={i} complaint={complaint} officer={officer} finding={allegation.final_finding}/>)
    }

    return (
      <div>
        {rows}
        <RequestModal />
      </div>
    )
  }

});

module.exports = Content;
