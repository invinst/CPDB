var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');


var LabelBar = React.createClass({
  propTypes: {
    segments: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      percent: PropTypes.number
    }))
  },

  render: function () {
    var leftFunc = LabelBar.calculateLeft();
    return (
      <div className='label-bar'>{
        _.map(this.props.segments, function (segment, i) {
          var styleProp = {
            left: leftFunc(segment) + '%'
          };

          return (
            <div key={ i } className='segment-label' style={ styleProp }>
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
