var React = require('react');

var Wrapper = require('components/Shared/Wrapper.react');
var OfficerPresenter = require('presenters/OfficerPresenter');


var OfficerSummarySection = React.createClass({
  propTypes: {
    officer: React.PropTypes.object
  },

  renderSummaryInfoItem: function (label, data) {
    var presenter = OfficerPresenter(this.props.officer);

    return (
      <Wrapper visible={ presenter.hasData(label) }>
        <span className='label'>{ label } </span>
        <span className='value'>{ data }</span>
      </Wrapper>
    );
  },

  render: function () {
    var officerPresenter = OfficerPresenter(this.props.officer);

    return (
      <Wrapper visible={ officerPresenter.hasSummarySection } wrapperClass='officer-summary-section'>
        <div className='pad'>
          { this.renderSummaryInfoItem('Rank', officerPresenter.rank) }
          { this.renderSummaryInfoItem('Unit', officerPresenter.unit) }
          { this.renderSummaryInfoItem('Joined', officerPresenter.joinedDate) }
          { this.renderSummaryInfoItem('Sex', officerPresenter.gender) }
          { this.renderSummaryInfoItem('Race', officerPresenter.race) }
        </div>
      </Wrapper>
    );
  }
});

module.exports = OfficerSummarySection;
