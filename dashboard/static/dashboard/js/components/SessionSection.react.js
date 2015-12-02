var _ = require('lodash');
var React = require('react');

var AddSessionAliasModal = require('./SessionSection/AddSessionAliasModal.react');
var Search = require('components/SessionSection/Search.react');
var Tabs = require('components/SessionSection/Tabs.react');
var SessionsAPI = require('utils/SessionsAPI');
var SessionList = require('components/SessionSection/SessionList.react');
var SessionAliasList = require('components/SessionSection/SessionAliasList.react');
var SessionSectionStore = require('stores/SessionSectionStore');
var Base = require('components/Base.react');


var SessionSection = React.createClass(_.assign(Base(SessionSectionStore), {
  componentDidMount: function () {
    SessionSectionStore.addChangeListener(this._onChange);
    SessionsAPI.get();
  },

  renderContent: function () {
    if (this.state.active == 'all') {
      return <SessionList />
    }
    return <SessionAliasList />
  },

  render: function() {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-9 col-xs-9'>
            <h1>
              Sessions Management
            </h1>
          </div>
        </div>
        <div>
          <div className='row'>
            <div className="col-md-8">
              <Tabs />
            </div>
            <div className="col-md-4 text-right">
              <Search />
            </div>
          </div>
          <div className='row'>
            <div id='sessions' className='col-md-12'>
              { this.renderContent() }
            </div>
          </div>
        </div>
        <AddSessionAliasModal />
      </div>
    )
  }
}));

module.exports = SessionSection;
