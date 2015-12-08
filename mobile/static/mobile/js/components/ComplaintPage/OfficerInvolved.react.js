var React = require('react');


var OfficerInvolved = React.createClass({
  renderOfficerRow: function (officer) {
    return (
      <div className='officer-card'>
        <div className='row'>
          <div className='one column circle-wrapper'>
            <div className='circle'></div>
          </div>
          <div className='eleven columns'>
            <div className='officer'>
              <div className='name bold'>{officer.name}</div>
              <div className='description'>{officer.description}</div>
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
    var involvedOfficers = this.props.involvedOfficers;
    var numberOfInvolvedOfficers = this.props.involvedOfficers.length;

    return (
      <div className='officer-involved'>
        <div className='row section-header'>
          <span className='section-title bold'>Officers involveds&nbsp;</span>
          <span className='title-count normal-weight'>({numberOfInvolvedOfficers})</span>
        </div>
        {this.renderOfficerList(involvedOfficers)}
      </div>
    )
  }
});

module.exports = OfficerInvolved;
