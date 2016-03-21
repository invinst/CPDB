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
  textMargin: 8,
  defaultLabelFont: 'normal normal 100 normal 14px / 20px \'Arial\'',
  percentageFont: 'normal normal bold normal 14px / 20px \'Arial\'',

  render: function () {
    return (
      <div className='label-bar'>{
        _.map(this.props.segments, function (segment, i) {
          var styleProp = {
            left: segment.translateX + '%'
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
