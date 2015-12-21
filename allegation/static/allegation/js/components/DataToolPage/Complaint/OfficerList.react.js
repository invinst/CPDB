var React = require('react');

var OfficerListWithInvestigator = require('components/DataToolPage/Complaint/OfficerListWithInvestigator.react');
var OfficerListWithoutInvestigator = require('components/DataToolPage/Complaint/OfficerListWithoutInvestigator.react');


var OfficerList = React.createClass({
  render: function () {
    var complaint = this.props.complaint;
    var investigation = this.props.investigation;

    return <OfficerListWithoutInvestigator complaint={complaint} investigation={investigation} />
  }
});

module.exports = OfficerList;
