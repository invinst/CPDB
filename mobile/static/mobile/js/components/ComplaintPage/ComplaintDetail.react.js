var React = require('react');

var ComplaintPresenter = require('presenters/ComplaintPresenter');
var HelperUtil = require('utils/HelperUtil');


var ComplaintDetail = React.createClass({
  render: function () {
    var info = this.props.info || {};
    var complaintPresenter = ComplaintPresenter(info);

    return (
      <div className='complaint-detail pad'>
        <div className='headline'>
          <span className='crid-info inline-block half-width align-left'>
            <span className='crid-title'>CRID</span>
            <span className='crid-number'>{info['crid']}</span>
          </span>
          <span className='final-finding inline-block half-width align-right'>
            {complaintPresenter.finalFinding}
          </span>
        </div>
        <div className='complaint-category bold'>
          {complaintPresenter.category}
        </div>
        <div className='complaint-sub-category'>
          {complaintPresenter.allegationName}
        </div>
        <a href='#' className='document-link'>View documents</a>
      </div>
    )
  }
});

module.exports = ComplaintDetail;
