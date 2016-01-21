var _ = require('lodash');
var numeral = require('numeral');
var React = require('react');

var AppConstants = require('../../../constants/AppConstants.js');
var Base = require('components/Base.react');
var SunburstStore = require('stores/SunburstStore');
var SunburstActions = require('actions/SunburstActions');
var FilterTagsActions = require('actions/FilterTagsActions');


var Legend = React.createClass(_.assign(Base(SunburstStore), {
  render: function () {
    var arc = this.state.hovering || SunburstStore.getSelected();

    if (!arc) {
      return <div></div>;
    }

    return (
      <div id='sunburst-legend'>
        <div className='root'>
          {this.renderRootContent(arc)}
        </div>
        <div className='percent'>
          {this.renderPercentStatement(arc)}
        </div>
        <div className='list'>
          <table>
            <tbody>
              {this.renderLegends()}
            </tbody>
          </table>
        </div>
      </div>
    );
  },

  getPercentateConnectString: function (arc) {
    var connectString = '';

    switch (arc.name) {
      case 'Allegations':
        connectString = 'of misconduct were';
        break;
      case 'Unsustained':
        connectString = 'complaints were found';
        break;
      default:
        connectString = 'complaints were';
        break;
    }

    return connectString;
  },

  renderRootContent: function (arc) {
    var total = SunburstStore.getArcSize(arc);
    var formattedTotal = numeral(total).format(AppConstants.NUMERAL_FORMAT);

    return (
      <div>
        {formattedTotal} {arc.name}
      </div>
    );
  },

  renderPercentStatement: function (arc) {
    var total = SunburstStore.getArcSize(arc);

    // Get max children
    if (arc.children) {
      var childrenLength = arc.children.length;
      var max = 0;
      var maxChildren;

      _.each(arc.children, function (child) {
        var size = SunburstStore.getArcSize(child);

        if (size > max) {
          maxChildren = child;
          max = size;
        }
      });
    }

    if (maxChildren) {
      var connectString = this.getPercentateConnectString(maxChildren);
      var percent = (max * 100 / total).toFixed(2);

      return (
        <div>
          <strong>{percent}%</strong> of "{arc.name}" {connectString} "{maxChildren.name}"
        </div>
      );
    }

    return <div></div>;
  },

  getLegends: function (arc) {
    var legends = [];

    if (arc.parent) {
      legends.push(arc.parent);
    }

    legends.push(arc);

    if (arc.children) {
      _.each(arc.children, function (child) {
        legends.push(child);
      });
    }

    return legends;
  },

  renderLegends: function () {
    var selected = SunburstStore.getSelected();

    if (selected) {
      var legends = this.getLegends(selected);
      var that = this;

      return _.map(legends, function (item, key) {
        var total = SunburstStore.getArcSize(item);
        if (!total) {
          return <tr></tr>;
        }

        var formattedTotal = numeral(total).format(AppConstants.NUMERAL_FORMAT);
        var style = {
          color: AppConstants.SUNBURST_ARC_COLORS[item.name]
        };

        return (
          <tr key={key} className='sunburst-legend' onClick={that.clickHandler.bind(that, item)}>
            <td className='color'><i className='fa fa-stop' style={style}></i></td>
            <td className='size'>{formattedTotal}</td>
            <td className='name'>{item.name}</td>
          </tr>
        );
      });
    }

    return <tr></tr>;
  },

  clickHandler: function (arc) {
    this.props.clickHandler(arc);
  }
}));

module.exports = Legend;
