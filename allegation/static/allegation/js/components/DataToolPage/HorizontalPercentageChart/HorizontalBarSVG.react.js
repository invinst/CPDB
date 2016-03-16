var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var S = require('string');


var HorizontalBarSVG = React.createClass({
  propTypes: {
    segments: PropTypes.arrayOf(PropTypes.shape({
      translateX: PropTypes.number,
      width: PropTypes.number,
      fill: PropTypes.string
    })),
    totalWidth: PropTypes.number,
    chartHeight: PropTypes.number
  },

  getDefaultProps: function () {
    return {
      chartHeight: 30
    };
  },

  render: function () {
    var self = this;
    return (
      <svg width={ self.props.totalWidth } height={ self.props.chartHeight }>
        { _.map(self.props.segments, function (segment, i) {
          var transformProp = S('translate({{x}},0)').template({x: segment.translateX}).s;
          var styleProp = _.pick(segment, ['fill']);

          return (
            <rect key={ i } width={ segment.width } height={ self.props.chartHeight }
              transform={ transformProp } style={ styleProp }/>
          );
        }) }
      </svg>
    );
  }
});

module.exports = HorizontalBarSVG;
