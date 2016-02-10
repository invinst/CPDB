var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');
var SvgUtil = require('utils/SvgUtil');


var DistributionCurve = React.createClass({
  propTypes: {
    officer: React.PropTypes.object,
    distribution: React.PropTypes.array
  },

  renderOfficerLine: function (numberOfComplaints, scaleX, scaleY) {
    return HelperUtil.format('{x},{y}', {'x': numberOfComplaints * scaleX / 70, 'y': scaleY});
  },

  render: function () {
    var data = this.props.distribution;

    // we keep distribution chart the same even we switch the portrait
    var screenWidthSize = Math.min(document.body.clientHeight, document.body.clientWidth);
    var wrapperWidthSize = screenWidthSize;
    var scaleTo320 = screenWidthSize / 320; // 320 is design-specific

    // Caculating max number of x and y axis
    var maxOfXAxis = data.length; // number of complaints
    var maxOfYAxis = CollectionUtil.getMax(data); // number of officers

    // by design, we have 36px padding in left and right
    var availableWidthForDistributionChart = screenWidthSize - 36 - 36;
    var availableHeightForDistributionChart = 122 * scaleTo320; // fixed by design
    var wrapperHeightSize = availableHeightForDistributionChart + 36 + 36;

    var scaleX = availableWidthForDistributionChart / maxOfXAxis;
    var scaleY = availableHeightForDistributionChart / maxOfYAxis;

    // Area chart is drawn as a polygon with first point is 0,0
    var firstPoint = '0,0'; // first point of poly line should be a
    var lastPoint = HelperUtil.format('{x},{y}',{'x': maxOfXAxis * scaleX, 'y':0});
    var points = [firstPoint, SvgUtil.arrayToPoints(data, scaleX, scaleY), lastPoint].join(' ');

    var x = HelperUtil.fetch(this.props.officer, 'allegations_count', 0);
    var lineX = x * scaleX;
    var lineY = (maxOfYAxis - 300) * scaleY; // it should be smaller than the max on of y a-xis a bit
    var style = {
      'paddingTop': wrapperHeightSize,
      'width': wrapperWidthSize
    };

    var viewBox = HelperUtil.format('0 0 {width} {height}', {'width': wrapperWidthSize, 'height': wrapperHeightSize});
    var translate = HelperUtil.format('translate(36, {y})', {'y': availableHeightForDistributionChart + 36});
    var numberOfOfficerTextX = -wrapperHeightSize / 2;

    return (
      <div className='distribution-curve'>
        <div className='distribution-curve-wrapper' style={ style }>
          <svg x='0px' y='0px' viewBox={ viewBox }>
            <g transform={ translate }>
              <g transform='scale(1, -1)'>
                <polygon
                  fill='#eaeaea'
                  stroke='#eaeaea'
                  strokeWidth='1'
                  points={ points }/>
                <line x1={ lineX } y1='0' x2={ lineX } y2={ lineY }
                  stroke='red'
                  strokeWidth='1' />
                <ellipse className='fill' fill='red' ry='5' rx='5' cy={ lineY } cx={ lineX }/>
              </g>
            </g>

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
