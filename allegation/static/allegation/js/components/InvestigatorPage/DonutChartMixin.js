var _ = require('lodash');
var React = require('react');


var DonutChartMixin = {
  buildBrowserData: function (props) {
    var chartData = props.chartData;
    var chartColors = props.chartColors;
    var defaultColor = props.defaultColor;

    return _.map(_.keys(chartData), function (chartDataKey) {
      return {
        name: chartDataKey,
        y: chartData[chartDataKey],
        color: chartColors[chartDataKey] || defaultColor
      }
    });
  },

  middleTextRender: function () {
    var chartData = this.buildBrowserData(this.props);
    var chartColors = this.props.chartColors;

    var categories = _.pluck(chartData, 'name');
    var fragtionText = _.pluck(chartData, 'y').join('/');

    var renderCategories = function () {
      return categories.map(function (category, i) {
        return (
          <div key={i}>
            <span style={{color: chartColors[category]}}>
              {category}
            </span>
          </div>
        );
      });
    };

    return (
      <span id="pieChartInfoText">
        <span style={{fontSize: '28px'}}>
          <strong>{fragtionText}</strong>
          <br/>
        </span>
        <span style={{fontSize: '16px'}}>
          <span>
            {renderCategories()}
          </span>
        </span>
      </span>
    );
  }
};

module.exports = DonutChartMixin;
