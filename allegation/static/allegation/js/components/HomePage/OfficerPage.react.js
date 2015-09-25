var HOST = 'http://localhost:8000';
var React = require('react');

var ComplaintSection = require('components/HomePage/OfficerPage/ComplaintSection.react');
var FilterActions = require("actions/FilterActions");
var OfficerDetail = require('components/HomePage/OfficerDetail.react');

var RelatedOfficers = require('components/HomePage/OfficerPage/RelatedOfficers.react');
var StoryList = require('components/HomePage/OfficerPage/StoryList.react');

var OfficerPage = React.createClass({

  getInitialState: function () {
    return {};
  },

  render: function () {
    var complaints = this.props.officer.allegations || [];
    
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
          <ComplaintSection officer={this.props.officer}/>
        </div>
      </div>
    );
  },
  
});

module.exports = OfficerPage;
