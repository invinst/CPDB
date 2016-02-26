var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');
var OfficerUtil = require('utils/OfficerUtil');
var SvgUtil = require('utils/SvgUtil');


var DistributionCurve = React.createClass({
  propTypes: {
    officer: React.PropTypes.object,
    distribution: React.PropTypes.array
  },

  renderOfficerLine: function (numberOfComplaints, scaleX, scaleY) {
    return HelperUtil.format('{x},{y}', {'x': numberOfComplaints * scaleX / 70, 'y': scaleY});
  },

  getAreaPoints: function (data, scaleX, scaleY) {
    // Area chart is drawn as a polygon with first point is 0,0
    var maxOfXAxis = data.length; // number of complaints
    var firstPoint = '0,0'; // first point of poly line should be 0, 0
    var lastPoint = HelperUtil.format('{x},{y}',{'x': maxOfXAxis * scaleX, 'y':0});
    var points = [firstPoint, SvgUtil.arrayToPoints(data, scaleX, scaleY), lastPoint].join(' ');

    return points;
  },

  render: function () {
    // TODO: Splitting this ernomous `render()`
    var data = this.props.distribution;
    var defaultPadding = 36;
    var defaultWidth = 320;
    var defaultChartHeight = 122;
    var redLineDifferentToMaxOfData = 30;

    // we keep distribution chart the same even we switch the portrait
    var screenWidthSize = Math.min(document.body.clientHeight, document.body.clientWidth);
    var wrapperWidthSize = screenWidthSize;
    var scaleTo320 = screenWidthSize / defaultWidth;

    // Caculating max number of x and y axis
    var maxOfXAxis = data.length; // number of complaints
    var maxOfYAxis = CollectionUtil.getMax(data); // number of officers

    // by design, we have 36px padding in left and right
    var availableWidthForDistributionChart = screenWidthSize - defaultPadding - defaultPadding;
    var availableHeightForDistributionChart = defaultChartHeight * scaleTo320; // fixed by design
    var wrapperHeightSize = availableHeightForDistributionChart + defaultPadding + defaultPadding;

    // calculating the scale between data and drawing panel size
    var scaleX = availableWidthForDistributionChart / maxOfXAxis;
    var scaleY = availableHeightForDistributionChart / maxOfYAxis;

    var allegationsCount = HelperUtil.fetch(this.props.officer, 'allegations_count', 0);
    var x = allegationsCount;
    var lineX = x * scaleX;
    // it should be smaller than the max on of y a-xis a bit
    var lineY = maxOfYAxis * scaleY - redLineDifferentToMaxOfData;

    var areaChartPoints = this.getAreaPoints(data, scaleX, scaleY);
    var style = {
      'paddingTop': wrapperHeightSize,
      'width': wrapperWidthSize
    };

    var viewBox = HelperUtil.format('0 0 {width} {height}', {'width': wrapperWidthSize, 'height': wrapperHeightSize});
    var translate = HelperUtil.format('translate(36, {y})', {'y': availableHeightForDistributionChart + 36});
    var numberOfOfficerTextX = -wrapperHeightSize / 2;
    var fillClass = OfficerUtil.getColorLevelClass('fill', allegationsCount);
    var strokeClass = OfficerUtil.getColorLevelClass('stroke', allegationsCount);

    return (
      <div className='distribution-curve'>
        <div className='distribution-curve-wrapper' style={ style }>
          <svg x='0px' y='0px' viewBox={ viewBox }>
            <g transform={ translate }>
              <g transform='scale(1, -1)'>
                <polygon
                  className='distribution-chart'
                  points={ areaChartPoints }/>
                <line className={ strokeClass } x1={ lineX } y1='0' x2={ lineX } y2={ lineY } />
                <ellipse className={ fillClass } ry='5' rx='5' cy={ lineY } cx={ lineX }/>
              </g>
            </g>

            <text textAnchor='middle' className={ fillClass } x={ lineX + defaultPadding } y='53'>
              { allegationsCount }
            </text>

            <g transform='rotate(-90)'>
              <text textAnchor='middle' className='legend' x={ numberOfOfficerTextX } y='18'>Number of Officers</text>
            </g>
            <text textAnchor='middle' className='legend' x={ wrapperWidthSize / 2 } y={ wrapperHeightSize - 14 }>
              Number of Complaints
            </text>
          </svg>
        </div>
      </div>
    );
  }
});

module.exports = DistributionCurve;
