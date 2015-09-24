var React = require('react');
var Search = require('./OfficerSection/Search.react');
var OfficerList = require('./OfficerSection/OfficerList.react');
var Officer = require('./OfficerSection/Officer.react');
var Base = require('./Base.react');
var OfficerSectionStore = require('../stores/OfficerSectionStore');
var OfficerSectionActions = require('../actions/OfficerSectionActions');
var _ = require('lodash');

var OfficerSection = React.createClass(_.assign(Base(OfficerSectionStore), {

  componentDidMount: function () {
    OfficerSectionStore.addChangeListener(this._onChange);
    if (this.props.params.id) {
      OfficerSectionActions.loadOfficer(this.props.params.id);
    }
  },

  content: function () {
    if (this.props.params.id) {
      return <Officer />
    }
    return <OfficerList />
  },

  render: function() {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-6 col-xs-6'>
            <h1>
              Officer Profile
            </h1>
          </div>
          <div id='search-officer' className='col-md-6 col-xs-6 text-right'>
            <Search />
          </div>
        </div>
        <div>
          <div className='row'>
            <div id='officers' className='col-md-12'>
              { this.content() }
            </div>
          </div>
        </div>
      </div>
    )
  }
}));

module.exports = OfficerSection;
