var React = require('react');

var cx = require('classnames');

var u = require('utils/HelperUtil');
var OfficerUtil = require('utils/OfficerUtil');


var CircleList = React.createClass({
  propTypes: {
    allegationCountList: React.PropTypes.array
  },

  renderCircle: function (count, index) {
    return (
       <div className={ cx('circle-wrapper', u.format('officer-{index}', {'index': index})) } key={ index }>
          <span className={ cx('circle', OfficerUtil.getColorLevelClass('circle', count)) }/>
       </div>
    );
  },

  render: function () {
    var allegationCountList = u.fetch(this.props, 'allegationCountList', []).sort(function (a, b) { return b - a; });

    return (
      <div>
        { allegationCountList.map(this.renderCircle) }
      </div>
    );
  }
});

module.exports = CircleList;
