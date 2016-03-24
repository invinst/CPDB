/*global L*/
var React = require('react');
var ReactDOM = require('react-dom');

var u = require('utils/HelperUtil');

var AppConstants = require('constants/AppConstants');
var AllegationPresenter = require('presenters/AllegationPresenter');
var Wrapper = require('components/Shared/Wrapper.react');

var Map;

require('mapbox.js');


Map = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object
  },

  componentDidMount: function () {
    var allegation = this.props.allegation;
    var point = u.fetch(allegation, 'point', '');
    var allegationPresenter = AllegationPresenter(allegation);
    var defaultZoom,
      center,
      mapbox,
      map,
      circle;

    if (point) {
      defaultZoom = 16;
      center = [point.y, point.x];
      mapbox = L.mapbox;

      mapbox.accessToken = AppConstants.MAPBOX_TOKEN;

      map = mapbox.map(ReactDOM.findDOMNode(this), 'mapbox.streets').setView(center, defaultZoom);
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();

      if (allegationPresenter.hasFullAddress) {
        L.marker(center).addTo(map);
      }
      else {
        circle = L.circle(center, 50, { color: 'red', fillColor: '#f03', fillOpacity: 0.5 }).addTo(map);
        circle.bindPopup('<b>Exact Address Not Available</b>').openPopup();
      }
    }
  },

  render: function () {
    var point = u.fetch(this.props.allegation, 'point', '');

    return (
      <Wrapper wrapperClass='map' visible={ (!!point) } />
    );
  }
});

module.exports = Map;
