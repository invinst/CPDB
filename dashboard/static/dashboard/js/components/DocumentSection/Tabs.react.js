var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var TabsStore = require('../../stores/DocumentSection/TabsStore');
var TabsActions = require('../../actions/DocumentSection/TabsActions');
var AppConstants = require('../../constants/AppConstants');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var cx = require('classnames');

var Tabs = React.createClass(_.assign(Base(TabsStore), {
  onClick: function (tab) {
    TabsActions.setActive(tab);
    DocumentRequestAPI.get();
  },

  renderTabs: function() {
    var that = this;
    return ['All', 'Missing', 'Requesting', 'Fulfilled'].map(function (x) {
      var className = cx({
        active: x == that.state.active
      });
      return <li className={className} onClick={that.onClick.bind(that, x)}>{x}</li>
    });
  },

  render: function() {
    return (
      <ul className="filter">
        {this.renderTabs()}
      </ul>
    );
  },
}));

module.exports = Tabs;
