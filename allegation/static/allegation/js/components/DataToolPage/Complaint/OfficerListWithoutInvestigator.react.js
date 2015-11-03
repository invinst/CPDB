var React = require('react');
var classnames = require('classnames');
var pluralize = require('pluralize');

var OfficerListMixin = require('components/DataToolPage/Complaint/OfficerListMixin.react');

var OfficerListWithoutInvestigator = React.createClass({
  mixins: [OfficerListMixin],

  getOfficerClass: function () {
    return 'col-md-3 col-xs-6 col-sm-3';
  },

  render: function () {
    var complaint = this.props.complaint;

    var officerCount = this.getOfficerCount();

    return (
      <div className="row officers">
        <div className='col-md-10 col-md-offset-1'>
          <div className="section-title">
            {pluralize('Officer', officerCount)} Involved
          </div>
          <div className="row">
            {this.renderOfficerList()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerListWithoutInvestigator;