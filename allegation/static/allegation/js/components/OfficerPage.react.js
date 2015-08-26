var HOST = 'http://localhost:8000';
var React = require('react');
var ComplaintList = require('./ComplaintList.react');
var RelatedOfficers = require('./Officer/RelatedOfficers.react');
var StoryList = require('./Officer/StoryList.react');
var OfficerDetail = require('./OfficerDetail.react');
var Officer = require('./Officer.react');
var Filters = require('./Filters.react');
var FilterActions = require("../actions/FilterActions");
var ReactTooltip = require("react-tooltip");


var OfficerPage = React.createClass({

  getInitialState: function () {
    return {};
  },

  componentWillMount: function () {
    FilterActions.replaceFilters([{
      value: ['officer', this.props.officer.id]
    }]);
  },

  render: function () {
    return (
      <div>
        <div className="map-row">
          <div className="container">
            <OfficerDetail officer={this.props.officer}/>
          </div>
        </div>
        <div className="container">
          <RelatedOfficers relatedOfficers={this.props.related}/>
          <ReactTooltip place='top' type='dark' effect='solid'/>
          <StoryList officer={this.props.officer} />
          <ComplaintList allegations={this.props.officer.allegations} officer={this.props.officer}/>
        </div>
      </div>
    );
  },
});

module.exports = OfficerPage;
