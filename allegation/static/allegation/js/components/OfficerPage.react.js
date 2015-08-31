var HOST = 'http://localhost:8000';
var React = require('react');

var ComplaintList = require('./ComplaintList.react');
var FilterActions = require("../actions/FilterActions");
var OfficerDetail = require('./OfficerDetail.react');

var RelatedOfficers = require('./OfficerPage/RelatedOfficers.react');
var StoryList = require('./OfficerPage/StoryList.react');


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
          <StoryList officer={this.props.officer} />
          <ComplaintList allegations={this.props.officer.allegations} officer={this.props.officer}/>
        </div>
      </div>
    );
  },
});

module.exports = OfficerPage;
