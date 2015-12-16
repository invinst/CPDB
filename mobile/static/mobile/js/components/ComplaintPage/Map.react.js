var React = require('react');
require('mapbox.js');


var Map = React.createClass({
  componentDidMount: function () {
    var point = this.props.point;
    if (point){
      var defaultZoom = 16;
      var center = [point.y, point.x];
      L.mapbox.accessToken = '***REMOVED***';
      var map = L.mapbox.map(this.getDOMNode(), 'mapbox.streets').setView(center, defaultZoom);
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      if (this.props.add1 && this.props.add2) {
        L.marker(center).addTo(map);
      } else {
        var circle = L.circle(center, 50, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map);
        circle.bindPopup('<b>Exact Address Not Available</b>');
      }
    }
  },

  render: function () {
    var point = this.props.point;
    if (!point){
      return (<div></div>);
    }
    return <div className='map'></div>;
  }
});

module.exports = Map;
