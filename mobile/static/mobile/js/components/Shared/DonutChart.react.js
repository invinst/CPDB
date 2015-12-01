var React = require('react');


var DonutChart = React.createClass({
  render: function () {
    var discipline = this.props.discipline || 0;
    var total = this.props.total || 1;
    var bold = {
      'fontWeight': '700'
    };

    var angle = 2 * Math.PI * discipline / total;
    var big = discipline * 2 > total ? 1 : 0;

    var x = 200 + 200 * Math.sin(angle);
    var y = 200 - 200 * Math.cos(angle);
    var middleText = discipline + '/' + total;
    var path = 'M 200,200 L 200,0 A 200,200 0 ' + big + ' 1 ' + x + ',' + y + ' Z';

    return (
      <div className='donut-chart'>
        <svg version='1.1' viewBox='0 0 400 400'>
          <circle cx='200' cy='200' r='200' fill='#000'></circle>
          <path d={path} fill='#ccc'></path>
          <circle cx='200' cy='200' r='150' fill='#fff'></circle>
          <g textAnchor='middle'>
            <text fontSize='40' style={bold} x='200' y='170'>{middleText}</text>
            <text fontSize='25' x='200' y='200' fill='#aaa'>Disciplined</text>
            <text fontSize='25' x='200' y='230'>Complaints</text>
          </g>
        </svg>
      </div>
    )
  }
});

module.exports = DonutChart;
