var React = require('react');
require('mapbox.js');
require('leaflet.heat');
var MapStore = require("../stores/MapStore");
var FilterStore = require('../stores/FilterStore');
var FilterActions = require("../actions/FilterActions");
var AppConstants = require('../constants/AppConstants');
var EmbedMixin = require('./Embed/Mixin.react');

L.mapbox.accessToken = AppConstants.MAP_TOKEN;

var highlightStyle = {
  color: '#2262CC',
  weight: 3,
  opacity: 0.6,
  fillOpacity: 0.65,
  fillColor: '#2262CC'
};
var _map = null;
var _geo_json_layer = null;
var _heat = null;
var _areas = {};
var _controls = {};
var _layers = {};
var _baseLayers = {};
var _controlDiv = null;
var _normalStyle = {"fillColor": "#eeffee", "fillOpacity": 0.0, 'weight': 2};
var _types = ['police-districts', 'wards', 'police-beats', 'neighborhoods', 'school-grounds'];


var Map = React.createClass({
  mixins: [EmbedMixin],

  getInitialState: function () {
    var state = {
      'maxZoom': 17,
      'minZoom': 10,
      'scrollWheelZoom': false,
      'center': this.props.center,
      'defaultZoom': this.props.defaultZoom
    };
    $.extend(state, MapStore.getState());
    return state;
  },

  // embedding
  getEmbedCode: function () {
    var node = this.getDOMNode();
    var width = $(node).width();
    var height = $(node).height();
    var src = "/embed/?page=map&query=" + encodeURIComponent(FilterStore.getQueryString());
    var state = MapStore.getState();
    state = {
      center: state.center,
      defaultZoom: state.defaultZoom
    }
    src += "&state=" + encodeURIComponent(JSON.stringify(state));
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },
  getEmbedNode: function () {
    this.embedNode = this.embedNode || $('<div class="embed-code"></div>');
    this.embedNode.append('<i class="fa fa-code"></i>');
    this.embedNode.append('<input type="text" value="" readonly="readonly" />');

    this.embedNode.find("input").on("click", function (e) {
      e.preventDefault();
      $(this).select();
    }).val(this.getEmbedCode());
    return this.embedNode;
  },

  removeEmbedNode: function () {
    this.getEmbedNode().remove();
    this.embedNode = null;
  },

  enterEmbedMode: function () {
    var node = this.getDOMNode();
    var parent = $(node).parent();
    $(parent).prepend(this.getEmbedNode())
  },

  leaveEmbedMode: function () {
    this.removeEmbedNode();
  },
  // end embedding

  componentDidMount: function () {
    this.create();
    this.createAreas();
    MapStore.update(this.props.query);

    MapStore.addChangeMarkerListener(this.changeMarker);
    MapStore.addBeforeChangeMarkerListener(this.beforeChangeMarker);

    this.embedListener();
  },

  mapIntensity: function(markersLength) {
    var intensity = 1;
    if (markersLength < 15000 ) {
       intensity = markersLength / 15000;
    }
    return intensity;
  },

  create :function (dom_id, opts) {
    dom_id = dom_id ? dom_id : this.getDOMNode();
    opts = opts ? opts : this.state;
    var defaultZoom = opts.defaultZoom ? opts['defaultZoom'] : 11;
    var center = opts.center ? opts['center'] : [41.85677, -87.6024055];

    var southWest = L.latLng(41.143501411390766, -88.53057861328125);
    var northEast = L.latLng(42.474122772511485, -85.39947509765625);
    var maxBounds = L.LatLngBounds(southWest, northEast);
    _map = L.mapbox.map(dom_id, AppConstants.MAP_TYPE, opts).setView(center, defaultZoom);

    _map.on('click', function (event) {
    }).setMaxBounds(maxBounds);

    _map.on('move', function () {
      var center = this.getCenter();
      MapStore.setState({
        'bounds': this.getBounds(),
        'defaultZoom': this.getZoom(),
        'center': center
      });
      FilterActions.saveSession();
    });
  },

  createAreas: function () {
    if (_geo_json_layer) {
      _map.removeLayer(_geo_json_layer);
    }

    this.getAreaBoundaries(_types[0]);

    L.Control.Command = L.Control.extend({
      options: {
          position: 'topright'
      },

      onAdd: function (map) {
          var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
          L.DomEvent
              .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
              .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
          .addListener(controlDiv, 'click', function () { MapShowCommand(); });

          var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
          controlUI.title = '';
          return controlDiv;
      }
    });
    L.control.command = function (options) {
        return new L.Control.Command(options);
    };
    var areaHover = new L.Control.Command();
    _map.addControl(areaHover);
  },

  onEachFeature: function (feature, layer) {
    var filters = FilterStore.getAll();
    layer.selected = false;
    if ('areas__id' in filters) {
      if (filters['areas__id']['value'].indexOf(feature.properties.id) > -1) {
        layer.selected = true;
        layer.setStyle(highlightStyle);
      }
    }

    var area_type = feature.properties.type;
    layer.on('mouseover', function () {
      $(".leaflet-control-command-interior").show().text(feature.properties.name);
      layer.setStyle(highlightStyle);
    });

    layer.on('mouseout', function () {
      $(".leaflet-control-command-interior").hide().text("");
      if (!layer.selected) {
        layer.setStyle(_normalStyle);
      }
    });

    var tagValue = {
      text: area_type + ": " + feature.properties.name,
      value: ['areas__id', feature.properties.id],
      layer: layer
    };

    layer.toggleStyle = function () {
      if (!layer.selected) {
        layer.selected = true;
        layer.setStyle(highlightStyle);
      }
      else {
        layer.selected = false;
        layer.setStyle(_normalStyle);
      }
    };

    layer.on('click', function () {
      if (!layer.selected) {
        $('#cpdb-search').tagsinput("add", tagValue);
      }
      else {
        $('#cpdb-search').tagsinput("remove", tagValue);
      }
    });
    if (!(area_type in _layers)) {
      _layers[area_type] = L.layerGroup();
      _baseLayers[prettyLabels(area_type).capitalize()] = _layers[area_type];
      if (!this.first_layer_added && area_type == 'police-districts') {
        this.first_layer_added = true;
        _map.addLayer(_baseLayers[prettyLabels(area_type).capitalize()]);
      }

    }
    _layers[area_type].addLayer(layer);

  },

  getAreaBoundaries: function (type) {
    var that = this;
    $.get("/api/areas/?type=" + type, function (data) {
      that.first_layer_added = false;
      _geo_json_layer = L.geoJson(data, {
        pointToLayer: L.mapbox.marker.style,
        style: function (feature) {
          return _normalStyle
        },
        onEachFeature: that.onEachFeature
      });
      var nextTypeIndex = _types.indexOf(type) + 1;
      if (_types[nextTypeIndex]) {
        that.getAreaBoundaries(_types[nextTypeIndex])
      }
      else {
        L.control.layers(_baseLayers,{}, {collapsed: false}).addTo(_map);
      }
    }, 'json').fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    })
  },

  beforeChangeMarker: function () {
    if (_heat) {
      _map.removeLayer(_heat);
    }
  },

  changeMarker: function () {
    this.setMarkers(MapStore.getMarkers());
  },

  setMarkers: function (markers) {
    var latLngs = [];
    var features = markers.features;
    var heatOpts = { radius: 10, max: this.mapIntensity(features.length) };

    if (_heat) {
      _map.removeLayer(_heat);
    }

    L.geoJson({features: features}, {
      pointToLayer: L.mapbox.marker.style,
      style: function (feature) {
        return feature.properties;
      },
      onEachFeature: function (feature, layer) {
        if (feature.geometry.coordinates && feature.geometry.coordinates[0]) {
          latLngs.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
        }
      }
    });
    _heat = L.heatLayer(latLngs, heatOpts);
    _map.addLayer(_heat);

  },

  render: function () {
    return <div id='map' className='pin-top pin-bottom'></div>
  }
});

module.exports = Map;
