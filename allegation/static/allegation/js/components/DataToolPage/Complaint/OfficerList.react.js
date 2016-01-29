var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;
var pluralize = require('pluralize');

var Officer = require('components/DataToolPage/Officer.react');


var OfficerList = React.createClass({
  propTypes: {
    allegation: PropTypes.object
  },

  getOfficerCount: function () {
    var allegation = this.props.allegation;
    return allegation.officers.length + (allegation.officer && 1);
  },

  renderOfficerList: function (allegation) {
    var officers = _.clone(allegation.officers);
    if (allegation.officer) {
      officers.unshift(allegation.officer);
    }

    return officers.map(function (officer, index) {
      return (
        <div className='col-md-3 col-sm-4 col-xs-6' key={ officer.id }>
          <Officer active={ true } officer={ officer } noClick={ true }/>
        </div>
      );
    });
  },

  render: function () {
    var allegation = this.props.allegation;
    var officerCount = this.getOfficerCount();

    return (
      <div>
        <div className='col-md-12'>
          <div className='section-title'>
            { pluralize('Officer', officerCount) } Involved
          </div>
        </div>
        { this.renderOfficerList(allegation) }
      </div>
    );
  }
});

module.exports = OfficerList;
