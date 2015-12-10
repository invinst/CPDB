var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var Map = require('components/Shared/Map.react');


var Location = React.createClass({
  getInitialState: function () {
    var firstAddress = HelperUtil.fetch(this.props.info, 'add1', '');
    var secondAddress = HelperUtil.fetch(this.props.info, 'add2', '');
    var locationType = HelperUtil.fetch(this.props.info, 'location', '');
    var beat = HelperUtil.fetch(this.props.info, 'beat', '');
    var city = HelperUtil.fetch(this.props.info, 'city', '');
    var address = firstAddress || secondAddress;

    return {
      'address': address,
      'beat': beat,
      'city': city,
      'locationType': locationType
    }
  },

  render: function () {
    return (
      <div className='location'>
        <div className='section-header bold'>
          <div className='section-title pad'>Location</div>
        </div>
        <div className='location-detail pad'>
          <div className='bold'>{this.state.address}</div>
          <div>
            <label>Beat </label>
            <span>{this.state.beat}</span>
          </div>
          <div>
            <label>Location type </label>
            <span>{this.state.locationType}</span>
          </div>
          <div>
            <label>City </label>
            <span>{this.state.city}</span>
          </div>
        </div>
        <div className='location-map pad'>
          <Map />
        </div>
      </div>
    )
  }
});

module.exports = Location;
