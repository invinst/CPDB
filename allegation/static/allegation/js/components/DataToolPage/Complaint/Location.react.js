var React = require('react');
var MapStore = require("stores/MapStore");
var AppConstants = require("constants/AppConstants");

var Location = React.createClass({

  renderMap: function () {
    var allegation = this.props.complaint.allegation;
    var imgSrc = '';

    if (allegation.point.lat) {
      var lat = allegation.point.lat;
      var lng = allegation.point.lng;
      var centerLng = lng + 0.02;
      var locationImage = '(' + lng + ',' + lat + ')/' + centerLng + ',' + lat + ',12/900x180.png';
      var mapImage;
      var marker = 'url-' + encodeURIComponent(AppConstants.MAP_MARKER_ICON_URL);

      if (allegation.add1 && allegation.add2) {
        mapImage = 'http://api.tiles.mapbox.com/v4/mapbox.streets/pin-l-cross+482';
      }
      else if (this.props.complaint.beat_name) {
        mapImage = 'http://api.tiles.mapbox.com/v4/mapbox.streets/url-' + encodeURIComponent(AppConstants.MAP_MARKER_ICON_URL);
      }

      mapImage += locationImage + '?access_token=' + AppConstants.MAP_TOKEN;
    }


    return (
      <div className='complaint-map'>
        <img alt='Marker is currently not available' src={mapImage} />
      </div>
    );
  },

  renderAddress: function () {
    var allegation = this.props.complaint.allegation;

    if (allegation.add1 && allegation.add2) {
      return (
        <div className='address-info row'>
          <div className='col-xs-3 col-md-12 text-bold'>{allegation.add1} {allegation.add2}</div>
          <div className='col-xs-3 col-md-12'><span className='title'>Beat</span> {this.props.complaint.beat_name}</div>
          <div className='col-xs-3 col-md-12'><span className='title'>Location Type</span> {allegation.location}</div>
          <div className='col-xs-3 col-md-12'><span className='title'>City</span> {allegation.city}</div>
        </div>
      );
    } else if (this.props.complaint.beat_name) {
      return (
        <div className='address-info row'>
          <div className='col-xs-3 col-md-12'><span className='title'>Beat</span> {this.props.complaint.beat_name}</div>
        </div>
      );
    }
    return "Exact Address Not Available";
  },

  render: function () {
    return (
      <div>
        <div className='col-xs-12 col-md-12'>
          <div className='section-title'>
            Location
          </div>
        </div>
        <div className='col-md-4 col-xs-12 col-md-push-8'>
         { this.renderAddress() }
        </div>
        <div className='col-md-8 col-xs-12 col-md-pull-4'>
          { this.renderMap() }
        </div>
      </div>
    );
  }
});

module.exports = Location;
