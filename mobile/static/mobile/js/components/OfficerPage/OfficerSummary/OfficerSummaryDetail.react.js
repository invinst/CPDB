var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');


var OfficerSummaryDetail = React.createClass({
  renderSummaryInfoItem: function (label, data) {
    return (
        <Wrapper visible={!!data}>
          <label className='label'>{label} </label>
          <span className='value'>{data}</span>
        </Wrapper>
      );
  },

  render: function () {
    return (
      <div className='officer-summary'>
        {this.renderSummaryInfoItem('Rank', 'Detective')}
        {this.renderSummaryInfoItem('Unit', '610 / Bureau of detectives - Area Central')}
        {this.renderSummaryInfoItem('Join', 'June 8th, 1998')}
        {this.renderSummaryInfoItem('Sex', 'Male')}
        {this.renderSummaryInfoItem('Race', 'White')}
      </div>
    )
  }
});

module.exports = OfficerSummaryDetail;
