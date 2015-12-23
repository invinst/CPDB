var React = require('react');

var ComplaintPresenter = require('presenters/ComplaintPresenter');
var OfficerPresenter = require('presenters/OfficerPresenter');

var OfficerComplaintItem = React.createClass({
  renderCircles: function (numberOfCircles) {
    var circles = [];

    for (var i = 0; i < numberOfCircles; i++) {
      circles.push(
        <div className='circle-wrapper'>
          <span className='circle'></span>
        </div>
      );
    }

    return circles;
  },

  render: function () {
    var complaint = this.props.complaint.data;
    var officerInvolvedCount = this.props.complaint['num_crids'] - 1;
    var officer = this.props.officer;

    var officerPresenter = OfficerPresenter(officer);
    var complaintPresenter = ComplaintPresenter(complaint);
    return (
      <div className='officer-complaint-item'>
        <div className='crid-info pad'>
          <div className='inline-block half-width align-left'>
            <span className='crid-title'>CRID &nbsp;</span>
            <span className='crid-number'>{complaintPresenter.crid}</span>
          </div>
          <div className='inline-block half-width align-right'>
            <span className='final-finding'>{complaintPresenter.finalFinding}</span>
          </div>
        </div>
        <div className='complaint-category'>
          <div className='pad'>
            <div className='category'>{complaintPresenter.category}</div>
            <div className='sub-category'>{complaintPresenter.allegationName}</div>
          </div>
        </div>
        <div className='related-info pad'>
          <div className='row'>
            <span className='label'>Incident</span>
            <span className='value'>{complaintPresenter.incidentDate}</span>
          </div>
          <div className='row'>
            <span className='label'>Officers</span>
            <span className='value'>
              {complaintPresenter.officerListDisplay(officerPresenter.displayName, officerInvolvedCount)}
            </span>
          </div>
          <div className='circles row'>
            {this.renderCircles(officerInvolvedCount + 1)}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerComplaintItem;
