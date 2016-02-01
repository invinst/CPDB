var _ = require('lodash');
var Base = require('../Base.react');
var cx = require('classnames');
var jQuery = require('jquery');
var React = require('react');

var AppConstants = require('../../constants/AppConstants');
var SessionSectionStore = require('../../stores/SessionSectionStore');
var TabsActions = require('../../actions/SessionSection/TabsActions');
var SessionsAPI = require('utils/SessionsAPI');
var SessionAliasAPI = require('utils/SessionAliasAPI');


var Tabs = React.createClass(_.assign(Base(SessionSectionStore), {
  onClick: function (code) {
    TabsActions.setActive(code);
  },

  componentDidUpdate: function () {
    if (this.state.active == 'all') {
      SessionsAPI.get();
    } else {
      SessionAliasAPI.get();
    }
  },

  renderTabs: function () {
    var that = this;
    return jQuery.map(AppConstants.SESSION_TABS, function (text, code) {
      var className = cx('tab-' + code, {
        active: code == that.state.active
      });
      return (
        <li key={ text } className={ className } onClick={ that.onClick.bind(that, code) }>
          { text }
        </li>
      );
    });
  },

  render: function () {
    return (
      <ul className='filter'>
        { this.renderTabs() }
      </ul>
    );
  }
}));

module.exports = Tabs;
