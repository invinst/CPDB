var _ = require('lodash');
var classnames = require('classnames');
var numeral = require('numeral');
var React = require('react');

var AppConstants = require('../../../constants/AppConstants.js');
var Base = require('components/Base.react');
var SunburstStore = require('stores/SunburstStore');
var SunburstActions = require('actions/SunburstActions');
var FilterTagsActions = require('actions/FilterTagsActions');


var Breadcrumb = React.createClass(_.assign(Base(SunburstStore), {
  render: function () {
    return (
      <div className='row'>
        <ol className="sunburst-breadcrumb">{this.renderBreadcrumb()}</ol>
      </div>
    );
  },

  renderBreadcrumb: function () {
    var arc = this.state.hovering || this.state.selected;
    if (!arc) {
      return '';
    }

    var breadcrumb = SunburstStore.getAncestorArcs(arc);
    var that = this;

    return _.map(breadcrumb, function (item, key) {
      var total = SunburstStore.getArcSize(item);
      var formattedTotal = numeral(total).format(AppConstants.NUMERAL_FORMAT);
      var className = classnames('sunburst-legend', {
        'active': item == that.state.selected
      });

      return (
        <li key={key} className={className} onClick={that.clickHandler.bind(that, item)}>
          {formattedTotal}<br />
          <span className="name">{item.name}</span>
        </li>
      );
    });
  },

  clickHandler: function (arc) {
    SunburstActions.selectArc(arc, this.state.selected);
    FilterTagsActions.saveTags();
  }
}));

module.exports = Breadcrumb;
