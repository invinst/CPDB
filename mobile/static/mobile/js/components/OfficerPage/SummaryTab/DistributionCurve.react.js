var React = require('react');

var HelperUtil = require('utils/HelperUtil');


function maxArray(items) {
  return items.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
}

var DistributionCurve = React.createClass({
  arrayToPoints: function (data, scaleX, scaleY) {
    var result = '';
    for (var i = 0; i < data.length; i++) {
      result = [result, HelperUtil.format('{i},{value}', {'i': i * scaleX, 'value': data[i] * scaleY})].join(' ');
    }

    return result;
  },

  renderOfficerLine: function (numberOfComplaints, scaleX, scaleY) {
    return HelperUtil.format('{x},{y}', {'x': numberOfComplaints * scaleX / 70, 'y': scaleY});
  },

  render: function () {
    var data = [2666, 1334, 781, 408, 222, 357, 357, 308, 285, 228, 189, 155, 148, 118, 102, 85, 76, 76, 48, 42, 42, 42,
    39, 26, 18, 20, 13, 11, 20, 17, 9, 9, 6, 8, 12, 11, 3, 7, 13, 1, 4, 3, 3, 0, 1, 1, 1, 2, 0, 1, 2, 0, 1, 0, 1, 0, 1,
    0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0];

    var maxDataValue = maxArray(data);
    var scaleX = 300 / 70;
    var scaleY = 200 / maxDataValue;
    var dataAsPoints = this.arrayToPoints(data, scaleX, scaleY);
    var endPoint = HelperUtil.format('{dataEnd},{end}',{'dataEnd':data.length * scaleX, 'end':0});
    var polyfillDataPoints = ['0,0', dataAsPoints, endPoint].join(' ');

    var x = 20;
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
