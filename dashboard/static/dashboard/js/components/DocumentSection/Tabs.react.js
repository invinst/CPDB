var Base = require('../Base.react');
var React = require('react');
var _ = require('lodash');
var jQuery = require('jquery');
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
    return jQuery.map(AppConstants.DOCUMENT_STATUS, function (x) {
      text = x['text'];
      var className = cx({
        active: text == that.state.active
      });
      return <li key={text} className={className} onClick={that.onClick.bind(that, text)}>{text}</li>
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
