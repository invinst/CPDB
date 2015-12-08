var React = require('react');

var Map = require('components/Shared/Map.react');


var Location = React.createClass({
  render: function () {
    var info = this.props.info;

    return (
      <div className='location'>
        <div className='section-header bold'>
          <div className='section-title'>Location of incident</div>
        </div>
        <div className='location-detail'>
          <div className='bold'>9500 S Throop St.</div>
          <div>
            <label>Location type: </label>
            <span>{info.location}</span>
          </div>
          <div>
            <label>City: </label>
            <span>{info.city}</span>
          </div>
        </div>
        <div className='location-map'>
          <Map />
        </div>
      </div>
    )
  }
});

module.exports = Location;
