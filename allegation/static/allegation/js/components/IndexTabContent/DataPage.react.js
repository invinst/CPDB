var React = require('react');

var AppStore = require('stores/AppStore');
var DataToolPage = require('components/DataToolPage.react');
var NavActions = require('actions/NavActions');


var DataPage = React.createClass({
  componentDidMount: function () {
    AppStore.addChangeSessionListener(this.onChangeSession);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeSessionListener(this.onChangeSession);
  },

  onChangeSession: function () {
    history.replaceState(null, null, AppStore.getDataToolUrl());
  },

  render: function () {
    return (
      <DataToolPage />
		);
  }
});

module.exports = DataPage;
