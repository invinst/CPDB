var React = require('react');
var MapStore = require("../../stores/MapStore");


var Location = React.createClass({
  getInitialState: function () {
    return {
      address: "Exact Address Not Available"
    };
  },
  componentDidMount: function () {
    var allegation = this.props.complaint.allegation;
    var map_image, address;
    if (allegation.point.lat) {
      var token = MapStore.getToken();
      var lat = allegation.point.lat;
      var lng = allegation.point.lng;

      var centerLng = lng - 0.02;

      if (allegation.add1 && allegation.add2) {
        map_image = (
          'http://api.tiles.mapbox.com/v4/mapbox.streets/pin-l-cross+482(' +
          lng + ',' + lat + ')/' + centerLng + ',' + lat + ',13/' + this.getSize() +
          '.png?access_token=' + token
        );
        address = (
          <div>
            <div>Location: {allegation.location}</div>
            <div>Address: {allegation.add1} {allegation.add2}</div>
            <div>City: {allegation.city}</div>
          </div>
        );
        this.setState({
          address: address,
          image: map_image
        });
      }
      else {
        map_image = (
          'http://api.tiles.mapbox.com/v4/mapbox.streets/url-http%3A%2F%2Fdata.invisible' +
          '.institute%2Fstatic%2F64x_map_marker.png(' + lng + ',' + lat + ')/' + centerLng + ',' + lat + ',13/' +
          this.getSize() +
          '.png?access_token=' + token
        );
        this.setState({
          image: map_image
        });
      }
    }
  },
  getSize: function() {
    return '360x168';
  },
  render: function () {
    var content;

    if (this.state.image) {
      content = (
        <div className="location">
          <div className='address'>
            {this.state.address}
          </div>
          <img src={this.state.image}/>
        </div>
      ) ;
    } else {
      content = this.state.address;
    }
    var className = "col-md-4 " + (this.props.className || '');
    return (
      <div className={className}>
        <div className="section-title">
          Location
        </div>
        {content}
      </div>
    );
  }
});

module.exports = Location;
