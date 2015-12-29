var cx = require('classnames');
var React = require('react');


var OfficerResult = React.createClass({
  render: function () {
    var classNames = cx({'hidden': !this.props.visible});

    return (
      <div className={classNames}>
      </div>
    )
  }
});

module.exports = OfficerResult;
