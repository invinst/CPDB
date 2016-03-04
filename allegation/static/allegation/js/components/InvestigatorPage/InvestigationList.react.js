var React = require('react');
var PropTypes = React.PropTypes;

var InvestigationListRow = require('components/InvestigatorPage/InvestigationListRow.react');


var InvestigationList = React.createClass({
  propTypes: {
    complaints: PropTypes.array
  },

  renderInvestigations: function () {
    var rows = [];
    var i, complaint, allegation;

    for (i = 0; i < this.props.complaints.length; i++) {
      complaint = this.props.complaints[i];
      allegation = complaint.allegation;

      rows.push(<InvestigationListRow key={ i } complaint={ complaint } finding={ allegation.final_finding }/>);
    }

    return rows;
  },

  render: function () {
    return (
      <div>
        { this.renderInvestigations() }
      </div>
    );
  }
});

module.exports = InvestigationList;
