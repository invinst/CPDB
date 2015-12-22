var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');


var OfficerSummarySection = React.createClass({
  renderSummaryInfoItem: function (label, data) {
    return (
        <Wrapper visible={!!data}>
          <span className='label'>{label} </span>
          <span className='value'>{data}</span>
        </Wrapper>
      );
  },

  render: function () {
    return (
      <div className='officer-summary-section'>
        <div className='pad'>
          {this.renderSummaryInfoItem('Rank', 'Detective')}
          {this.renderSummaryInfoItem('Unit', '610 / Bureau of detectives - Area Central')}
          {this.renderSummaryInfoItem('Joined', 'June 8th, 1998')}
          {this.renderSummaryInfoItem('Sex', 'Male')}
          {this.renderSummaryInfoItem('Race', 'White')}
        </div>
      </div>
    );
  }
});

module.exports = OfficerSummarySection;
