var React = require('react');


var OfficerInvolved = React.createClass({
  renderOfficerRow: function (officer) {
    return (
      <div className='officer-card pad'>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <div className='circle'></div>
          </div>
          <div className='eleven columns'>
            <div className='officer'>
              <div className='name bold'>{officer['name']}</div>
              <div className='description'>{officer['description']}</div>
            </div>
          </div>
        </div>
      </div>
    )
  },

  renderOfficerList: function (involvedOfficers) {
    return (
      <div className='officer-list'>
        {involvedOfficers.map(this.renderOfficerRow)}
      </div>
    )
  },

  render: function () {
    var officers = this.props.involvedOfficers || [];
    var numberOfInvolvedOfficers = officers.length;

    return (
      <div className='officer-involved'>
        <div className='row section-header'>
          <span className='pad'>
            <span className='section-title bold'>Officers involved&nbsp;</span>
            <span className='title-count normal-weight'>({numberOfInvolvedOfficers})</span>
          </span>
        </div>
        {this.renderOfficerList(officers)}
      </div>
    )
  }
});

module.exports = OfficerInvolved;
