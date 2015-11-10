var React = require('react');
var classnames = require('classnames');
var pluralize = require('pluralize');
var _ = require('lodash');

var OfficerListMixin = require('components/DataToolPage/Complaint/OfficerListMixin.react');
var Officer = require('components/DataToolPage/Officer.react');

var OfficerListWithoutInvestigator = React.createClass({
  mixins: [OfficerListMixin],

  renderOfficerList: function () {
    var that = this;
    var complaint = this.props.complaint;

    var officers = _.clone(complaint.officers);
    if (complaint.officer) {
      officers.unshift(complaint.officer);
    }

    return officers.map(function (officer, index) {
      var officerClass = classnames('col-lg-2 col-md-2 col-sm-3 col-xs-6', {
        'col-lg-offset-1': (index % 5) == 0,
        'col-md-offset-1': (index % 5) == 0
      });

      return (
        <div className={officerClass} key={officer.id}>
          <Officer active={true} officer={officer} noClick={true}/>
        </div>
      );
    });
  },

  render: function () {
    var complaint = this.props.complaint;

    var officerCount = this.getOfficerCount();

    return (
      <div className="no-investigator">
        <div className="row officers">
          <div className='col-md-10 col-md-offset-1'>
            <div className="section-title">
              {pluralize('Officer', officerCount)} Involved
            </div>
          </div>
        </div>
        <div className="row">
        { this.renderOfficerList() }
        </div>
      </div>
    );
  }
});

module.exports = OfficerListWithoutInvestigator;