var React = require('react');


var ComplaintDetail = React.createClass({
  getInitialState: function () {
    var info = this.props.info || {
        'crid': '',
        'final_finding': '',
        'cat': {
          'category': '',
          'allegation_name': ''
        }
    };

    return {
      'info': info
    };
  },

  render: function () {
    var info = this.state.info;

    return (
      <div className='complaint-detail pad'>
        <div className='headline'>
          <span className='crid-info inline-block half-width align-left'>
            <span className='crid-title'>CRID</span>
            <span className='crid-number'>{info.crid}</span>
          </span>
          <span className='final-finding inline-block half-width align-right'>
            {info.final_finding}
          </span>
        </div>
        <div className='complaint-category bold'>
          {info.cat.category}
        </div>
        <div className='complaint-sub-category'>
          {info.cat.allegation_name}
        </div>
        <a href='#' className='document-link'>View documents</a>
      </div>
    )
  }
});

module.exports = ComplaintDetail;
