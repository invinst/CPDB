var React = require('react');
var classnames = require('classnames');
var pluralize = require('pluralize');

var Investigator = require('components/DataToolPage/Complaint/Investigator.react');
var OfficerListMixin = require('components/HomePage/Complaint/OfficerListMixin.react');

var OfficerListWithInvestigator = React.createClass({
  mixins: [OfficerListMixin],

  getOfficerClass: function () {
    var officerCount = this.getOfficerCount();
    switch (officerCount) {
      case 1:
        return 'col-md-12 col-xs-6 col-sm-12';
      case 2:
        return 'col-md-6 col-xs-6 col-sm-6';
      default:
        return 'col-md-4 col-xs-4 col-sm-4';
    }
  },

  render: function () {
    var complaint = this.props.complaint;
    var investigation = this.props.investigation;

    var officerCount = this.getOfficerCount();

    var officerCol = 6;
    if (officerCount < 3) {
      officerCol = officerCount * 2;
    }

    var officerColClass = classnames("col-md-" + officerCol, " col-md-offset-1", {
      hidden: !officerCount
    });
    var investigatorClass = classnames("col-md-4", {
      "col-md-offset-1": !officerCount
    });

    return (
      <div className="row officers">
        <div className={officerColClass}>
          <div className="section-title">
            {pluralize('Officer', officerCount)} Involved
          </div>
          <div className="row">
            {this.renderOfficerList()}
          </div>
        </div>
        <div className={investigatorClass} key="investigator">
          <div className="section-title">
            Investigator
          </div>
          <Investigator complaint={complaint}/>
        </div>
      </div>
    );
  }
});

module.exports = OfficerListWithInvestigator;