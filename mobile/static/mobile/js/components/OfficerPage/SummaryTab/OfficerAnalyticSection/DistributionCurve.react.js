var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');
var SvgUtil = require('utils/SvgUtil');


var DistributionCurve = React.createClass({
  propTypes: {
    distribution: React.PropTypes.array
  },

  renderOfficerLine: function (numberOfComplaints, scaleX, scaleY) {
    return HelperUtil.format('{x},{y}', {'x': numberOfComplaints * scaleX / 70, 'y': scaleY});
  },

  render: function () {
    var data = this.props.distribution;

    var maxDataValue = CollectionUtil.getMax(data);
    var scaleX = 300 / 70;
    var scaleY = 200 / maxDataValue;
    var dataAsPoints = SvgUtil.arrayToPoints(data, scaleX, scaleY);
    var endPoint = HelperUtil.format('{dataEnd},{end}',{'dataEnd':data.length * scaleX, 'end':0});
    var polyfillDataPoints = ['0,0', dataAsPoints, endPoint].join(' ');

    var x = HelperUtil.fetch(this.props.officer, 'allegations_count', 0);
    var lineX = x * scaleX;
    var lineY = (maxDataValue - 300) * scaleY;

    return (
      <div className='distribution-curve'>
        <svg x='0px' y='0px' viewBox='0 0 320 200'>
          <g transform='translate(10,200)'>
            <g transform='scale(1, -1)'>
              <polygon
                fill='#eaeaea'
                stroke='#eaeaea'
                strokeWidth='1'
                points={ polyfillDataPoints }/>
              <line x1={ lineX } y1='0' x2={ lineX } y2={ lineY }
                stroke='red'
                strokeWidth='1' />
              <ellipse className='fill' fill='red' ry='5' rx='5' cy={ lineY } cx={ lineX }/>
            </g>
          </g>

        </svg>
      </div>
    );
  }
});

module.exports = DistributionCurve;
