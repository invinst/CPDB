var React = require('react');

var ComplaintPresenter = require('presenters/ComplaintPresenter');
var HelperUtil = require('utils/HelperUtil');


var ComplaintDetail = React.createClass({
  render: function () {
    var info = this.props.info || {};
    var complaintPresenter = ComplaintPresenter(info);
    var category = HelperUtil.fetch(info, 'cat.category', 'Unknown');
    var allegationName = HelperUtil.fetch(info, 'cat.allegation_name', 'Unknown');

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
          {category}
        </div>
        <div className='complaint-sub-category'>
          {allegationName}
        </div>
        <a href='#' className='document-link'>View documents</a>
      </div>
    )
  }
});

module.exports = ComplaintDetail;
