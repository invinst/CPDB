var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var classnames = require('classnames');

var FilterTagsActions = require('actions/FilterTagsActions');


var HorizontalBarSVG = React.createClass({
  propTypes: {
    segments: PropTypes.arrayOf(PropTypes.shape({
      translateX: PropTypes.number,
      width: PropTypes.number,
      fill: PropTypes.string,
      filters: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        displayValue: PropTypes.string
      }))
    })),
    totalWidth: PropTypes.number,
    chartHeight: PropTypes.number,
    displayCategory: PropTypes.string,
    category: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func
  },

  getDefaultProps: function () {
    return {
      chartHeight: 30
    };
  },

  _onClick: function (segment) {
    var self = this;
    var tags = _.map(segment.filters, function (filter) {
      return {
        category: self.props.category,
        value: filter.value,
        displayCategory: self.props.displayCategory,
        displayValue: filter.displayValue
      };
    });
    FilterTagsActions.toggleTags(tags);
  },

  _onMouseOver: function (ind) {
    var self = this;
    return function () {
      self.props.onMouseOver(ind);
    };
  },

  render: function () {
    var self = this;
    var segmentClass;
    var styleProp;

    return (
      <svg viewBox='0 0 500 30' preserveAspectRatio='none' onMouseOut={ self.props.onMouseOut }
        width='100%' height={ self.props.chartHeight }>
        { _.map(self.props.segments, function (segment, i) {
          segmentClass = classnames({
            active: segment.active
          });
          styleProp = _.pick(segment, ['fill']);

          return (
            <rect key={ i } width={ segment.width + '%' } height={ self.props.chartHeight } className={ segmentClass }
              x={ segment.translateX + '%' } style={ styleProp } onClick={ self._onClick.bind(self, segment) }
              onMouseOver={ self._onMouseOver(i) }/>
          );
        }) }
      </svg>
    );
  }
});

module.exports = HorizontalBarSVG;
