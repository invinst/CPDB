var React = require('react');

var Map = require('components/Shared/Map.react');


var Location = React.createClass({
  render: function () {
    var info = this.props.info;

    return (
      <div className='location'>
        <div className='section-header bold'>
          <div className='section-title pad'>Location</div>
        </div>
        <div className='location-detail pad'>
          <div className='bold'>9500 S Throop St.</div>
          <div>
            <label>Location type </label>
            <span>{info.location}</span>
          </div>
          <div>
            <label>City </label>
            <span>{info.city}</span>
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
