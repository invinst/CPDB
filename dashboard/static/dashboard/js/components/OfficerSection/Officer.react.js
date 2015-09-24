var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var OfficerStore = require('../../stores/OfficerSection/OfficerStore');
var OfficerActions = require('../../actions/OfficerSection/OfficerActions');
var OfficerAPI = require('../../utils/OfficerAPI');

var OfficerTabs = require('./Officer/Tabs.react');
var OfficerProfile = require('./Officer/Profile.react');
var StoryForm = require('./Officer/StoryForm.react');

var Officer = React.createClass(_.assign(Base(OfficerStore), {
  getOfficerName: function () {
    var text = '';
    if (this.state.officer) {
        text = this.state.officer.officer_first + ' ' + this.state.officer.officer_last;
    }
    return <h4 className="col-md-6 col-xs-12">{text}</h4>
  },

  getContent: function () {
    return this[this.state.method]();
  },

  officerProfile: function () {
    return <OfficerProfile />;
  },

  storyForm: function () {
    return <StoryForm />
  },

  render: function() {
    return (
      <div>
        <div className="row">
          { this.getOfficerName() }
          <OfficerTabs />
        </div>
        <div className="well">
          { this.getContent() }
        </div>
      </div>
    );
  }

}));

module.exports = Officer;
