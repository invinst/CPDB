var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');
var OfficerPresenter = require('presenters/OfficerPresenter');

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
    var officerPresenter = OfficerPresenter(this.props.officer);

    return (
      <div className='officer-summary-section'>
        <div className='pad'>
          {this.renderSummaryInfoItem('Rank', officerPresenter.rank)}
          {this.renderSummaryInfoItem('Unit', officerPresenter.unit)}
          {this.renderSummaryInfoItem('Joined', officerPresenter.joinDate)}
          {this.renderSummaryInfoItem('Sex', officerPresenter.gender)}
          {this.renderSummaryInfoItem('Race', officerPresenter.race)}
        </div>
      </div>
    );
  }
});

module.exports = OfficerSummarySection;
