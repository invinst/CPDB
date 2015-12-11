var cx = require('classnames');
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
    var info = this.props.info || {};
    var firstAddress = HelperUtil.fetch(info, 'add1', '');
    var secondAddress = HelperUtil.fetch(info, 'add2', '');
    var locationType = HelperUtil.fetch(info, 'location', '');
    var beat = HelperUtil.fetch(info, 'beat', '');
    var city = HelperUtil.fetch(info, 'city', '');
    var address = [firstAddress, secondAddress].join(' ').trim(); // a bit magic here :>)
    var noData = !locationType && !beat && !city && !address;

    var locationDetailClassnames = cx('location-detail pad', {
      'no-data': noData
    });

    return (
      <div className='location'>
        <div className='section-header bold'>
          <div className='section-title pad'>Location</div>
        </div>
        <div className={locationDetailClassnames}>
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
