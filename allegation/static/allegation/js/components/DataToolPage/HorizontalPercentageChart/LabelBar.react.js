var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');

var DOMUtils = require('utils/DOMUtils');


var LabelBar = React.createClass({
  propTypes: {
    segments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      percent: PropTypes.number
    })),
    chartWidth: PropTypes.number
  },
  textMargin: 8,
  defaultLabelFont: 'normal normal 100 normal 14px / 20px \'Arial\'',
  percentageFont: 'normal normal bold normal 14px / 20px \'Arial\'',

  render: function () {
    var leftFunc = LabelBar.calculateLeft(
      this.textMargin, this.defaultLabelFont, this.percentageFont, this.props.chartWidth
    );
    return (
      <div className='label-bar'>{
        _.map(this.props.segments, function (segment, i) {
          var styleProp = {
            left: leftFunc(segment)
          };

          return (
            <div key={ i } className='segment-label' style={ styleProp }>
              <p className='segment-name'>{ segment.label }</p>
              <p className='segment-percentage'>{ segment.percent + '%' }</p>
            </div>
          );
        })
      }</div>
    );
  }
});

LabelBar.calculateLeft = function (textMargin, labelFont, percentFont, chartWidth) {
  var segmentWidthAccum = 0;
  var textLengthAccum = 0;

  function next(segment) {
    var left = _.max([segmentWidthAccum, textLengthAccum]);
    var textLength = _.max([
      DOMUtils.getTextWidth(segment.label, labelFont),
      DOMUtils.getTextWidth(segment.percent + '%', percentFont)
    ]) + textMargin;

    segmentWidthAccum += segment.width * chartWidth / 100;
    textLengthAccum += textLength;

    return left;
  }

  return next;
},

module.exports = LabelBar;
