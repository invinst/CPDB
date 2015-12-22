var React = require('react');
var classnames = require('classnames');
var pluralize = require('pluralize');
var ReactRouter = require('react-router');

var Link = ReactRouter.Link;

var Investigator = require('components/DataToolPage/Complaint/Investigator.react');
var OfficerListMixin = require('components/DataToolPage/Complaint/OfficerListMixin.react');
var Officer = require('components/DataToolPage/Officer.react');

var StringUtil = require('utils/StringUtil');

var OfficerListWithInvestigator = React.createClass({
  mixins: [OfficerListMixin],

  getOfficerClass: function () {
    var officerCount = this.getOfficerCount();
    switch (officerCount) {
      case 1:
        return 'col-md-12 col-xs-6 col-sm-6';
      case 2:
        return 'col-md-6 col-xs-6 col-sm-6';
      default:
        return 'col-md-4 col-xs-4 col-sm-4';
    }
  },

  renderOfficerList: function () {
    var complaint = this.props.complaint;
    var officerClass = this.getOfficerClass();

    var officers = complaint.officers.map(function (officer) {
      return (
        <div className={officerClass} key={officer.id}>
          <Officer active={true} officer={officer} noClick={true}/>
        </div>
      );
    });

    if (complaint.officer) {
      officers.unshift(
        <div className={officerClass} key={complaint.officer.id}>
          <Officer active={true} officer={complaint.officer} noClick={true}/>
        </div>
      );
    }

    return officers;
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
          <Link to={this.investigatorLink(complaint.investigator)}>
            <Investigator complaint={complaint}/>
          </Link>
        </div>
      </div>
    );
  },

  investigatorLink: function (investigator) {
    return '/investigator/' + StringUtil.slugify(investigator.name) + '/' + investigator.id;
  }
});

module.exports = OfficerListWithInvestigator;
