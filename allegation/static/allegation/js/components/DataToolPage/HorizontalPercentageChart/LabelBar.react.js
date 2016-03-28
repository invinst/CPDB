var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var classnames = require('classnames');


var LabelBar = React.createClass({
  propTypes: {
    segments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      percent: PropTypes.number
    })),
    hoverInd: PropTypes.number
  },

  render: function () {
    var leftFunc = LabelBar.calculateLeft();
    var self = this;
    return (
      <div className='label-bar'>{
        _.map(this.props.segments, function (segment, i) {
          var styleProp = {
            left: leftFunc(segment) + '%'
          };
          var labelClass = classnames('segment-label', {
            'active': segment.active,
            'hover': self.props.hoverInd === i
          });

          return (
            <div key={ i } className={ labelClass } style={ styleProp }>
              <span className='segment-percentage'>{ segment.percent + '%' }</span>
              <span className='segment-name'>{ segment.label }</span>
            </div>
          );
        })
      }</div>
    );
  }
});

LabelBar.calculateLeft = function () {
  var segmentWidthAccum = 0;

  function next(segment) {
    var left = segmentWidthAccum;
    segmentWidthAccum += segment.width;
    return left;
  }

  return next;
},

module.exports = LabelBar;
