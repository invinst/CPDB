var Base = require('../../Base.react');
var React = require('react');
var _ = require('lodash');

var OfficerStore = require('../../../stores/OfficerSection/OfficerStore');

var OfficerTab = React.createClass(_.assign(Base(OfficerStore), {

  render: function() {
    return (
      <div className="col-md-6 col-xs-12 text-right">
        <ul className="filter">
          <li>Add story</li>
          <li>Edit information</li>
        </ul>
      </div>
    );
  }

}));

module.exports = OfficerTab;
