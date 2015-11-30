var React = require('react');

var Map = require('components/Shared/Map.react');


var Location = React.createClass({
  render: function () {
    return (
      <div className='location'>
        <div className='section-header'>
          <div className='section-title'>Where</div>
        </div>
        <div className="location-detail">
          <div>
            <label>Beat</label>
            <span>1214</span>
          </div>
          <div>
            <label>Location</label>
            <span>17</span>
          </div>
          <div>
            <label>Address</label>
            <span>9500 S Throop St.</span>
          </div>
          <div>
            <label>City</label>
            <span>Chicago IL 60643</span>
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
