var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');


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
      <svg viewBox='0 0 500 30' preserveAspectRatio='none'
        width='100%' height={ self.props.chartHeight }>
        { _.map(self.props.segments, function (segment, i) {
          var styleProp = _.pick(segment, ['fill']);
          return (
            <rect key={ i } width={ segment.width + '%' } height={ self.props.chartHeight }
              x={ segment.translateX + '%' } style={ styleProp }/>
          );
        }) }
      </svg>
    );
  }
});

module.exports = HorizontalBarSVG;
