var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var Map = require('components/Shared/Map.react');


var Location = React.createClass({
  renderLocationInfoItem: function (label, data) {
    if (!data) {
      return (
        <div></div>
      )
    } else {
      return (
        <div>
          <label>{label} </label>
          <span>{data}</span>
        </div>
      )
    }
  },

  render: function () {
    var firstAddress = HelperUtil.fetch(this.props.info, 'add1', '');
    var secondAddress = HelperUtil.fetch(this.props.info, 'add2', '');
    var locationType = HelperUtil.fetch(this.props.info, 'location', '');
    var beat = HelperUtil.fetch(this.props.info, 'beat', '');
    var city = HelperUtil.fetch(this.props.info, 'city', '');
    var address = firstAddress || secondAddress;

    return (
      <div className='location'>
        <div className='section-header bold'>
          <div className='section-title pad'>Location</div>
        </div>
        <div className='location-detail pad'>
          <div className='bold'>{address}</div>
          {this.renderLocationInfoItem('Beat', beat)}
          {this.renderLocationInfoItem('Location type', locationType)}
          {this.renderLocationInfoItem('City', city)}
        </div>
        <div className='location-map pad'>
          <Map />
        </div>
      </div>
    )
  }
});

module.exports = Location;
