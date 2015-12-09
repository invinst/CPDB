var React = require('react');


var ProgressBar = React.createClass({
  render: function () {
    var value = this.props.value || 0;
    var total = this.props.total || 1;
    var percent = (100 * value / total) + '%';
    var style = {width: percent};

    return (
      <div className='progress-bar'>
        <div className='value' style={style}>
        </div>
      </div>
    )
  }
});

module.exports = ProgressBar;
