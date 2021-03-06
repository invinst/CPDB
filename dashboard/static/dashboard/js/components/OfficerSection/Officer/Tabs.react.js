var Base = require('../../Base.react');
var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');

var TabsStore = require('../../../stores/OfficerSection/Officer/TabsStore');
var TabsActions = require('../../../actions/OfficerSection/Officer/TabsActions');

var Tabs = React.createClass(_.assign(Base(TabsStore), {

  clickFor: function (tab) {
    return this.onClick.bind(this, tab);
  },

  onClick: function (tab) {
    TabsActions.setActive(tab.method);
  },

  getTabs: function () {
    var that = this;
    return this.state.tabs.map(function (x) {
      var className = classnames({
        'active': x.method == that.state.active
      });

      return (
        <li onClick={ that.clickFor(x) } className={ className } key={ x.text }>{ x.text }</li>
      );
    });
  },

  render: function () {
    return (
      <div className='col-md-6 col-xs-12 text-right'>
        <ul className='filter'>
          { this.getTabs() }
        </ul>
      </div>
    );
  }

}));

module.exports = Tabs;
