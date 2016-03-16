var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');

var DOMUtils = require('utils/DOMUtils');

var LabelBar = React.createClass({
  propTypes: {
    segments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      percent: PropTypes.number
    }))
  },
  textMargin: 8,
  defaultLabelFont: 'normal normal 100 normal 14px / 20px \'Arial\'',
  percentageFont: 'normal normal bold normal 14px / 20px \'Arial\'',

  calculateLeft: function (textMargin, labelFont, percentFont) {
    var segmentWidthAccum = 0;
    var textLengthAccum = 0;

    function next(segment) {
      var left = _.max([segmentWidthAccum, textLengthAccum]);
      var textLength = _.max([
        DOMUtils.getTextWidth(segment.label, labelFont),
        DOMUtils.getTextWidth(segment.percent + '%', percentFont)
      ]) + textMargin;

      segmentWidthAccum += segment.width;
      textLengthAccum += textLength;

      return left;
    }

    return next;
  },

  render: function () {
    var self = this;
    var leftFunc = this.calculateLeft(self.textMargin, self.defaultLabelFont, self.percentageFont);

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

module.exports = LabelBar;
