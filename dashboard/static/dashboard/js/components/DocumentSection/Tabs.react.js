var _ = require('lodash');
var Base = require('../Base.react');
var cx = require('classnames');
var jQuery = require('jquery');
var React = require('react');

var AppConstants = require('../../constants/AppConstants');
var DocumentRequestAPI = require('../../utils/DocumentRequestAPI');
var DocumentRequestAnalysisAPI = require('../../utils/DocumentRequestAnalysisAPI');
var TabsStore = require('../../stores/DocumentSection/TabsStore');
var TabsActions = require('../../actions/DocumentSection/TabsActions');


var Tabs = React.createClass(_.assign(Base(TabsStore), {
  componentDidMount: function () {
    DocumentRequestAnalysisAPI.get();
  },

  onClick: function (tab) {
    TabsActions.setActive(tab);
    DocumentRequestAPI.get();
  },

  renderTabs: function() {
    var that = this;
    return jQuery.map(AppConstants.DOCUMENT_STATUS, function (x) {
      text = x['text'];
      var className = cx('tab-' + text.toLowerCase(), {
        active: text == that.state.active
      });
      return (
        <li key={text} className={className} onClick={that.onClick.bind(that, text)}>
          {text} <span className="analysis">({that.state.analysis[text]})</span>
        </li>
      );
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
