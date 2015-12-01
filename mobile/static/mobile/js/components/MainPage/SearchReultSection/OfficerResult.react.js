var cx = require('classnames');
var React = require('react');

var OfficerList = require('components/Shared/OfficerList.react');


var OfficerResult = React.createClass({
  render: function () {
    var classNames = cx({'hidden': !this.props.visible});

    return (
      <div className={classNames}>
        <OfficerList />
      </div>
    )
  }
});

module.exports = OfficerResult;
