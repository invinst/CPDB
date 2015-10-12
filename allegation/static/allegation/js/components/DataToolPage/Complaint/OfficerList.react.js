var React = require('react');

var OfficerListWithInvestigator = require('components/HomePage/Complaint/OfficerListWithInvestigator.react');
var OfficerListWithoutInvestigator = require('components/HomePage/Complaint/OfficerListWithoutInvestigator.react');


var OfficerList = React.createClass({
  render: function () {
    var complaint = this.props.complaint;
    var investigation = this.props.investigation;

    if (complaint.allegation.investigator) {
      return <OfficerListWithInvestigator complaint={complaint} investigation={investigation} />
    }
    return <OfficerListWithoutInvestigator complaint={complaint} investigation={investigation} />
  }
});

module.exports = OfficerList;
