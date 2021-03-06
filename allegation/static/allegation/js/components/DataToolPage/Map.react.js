
var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');

var MapStore = require('stores/MapStore');
var FilterTagStore = require('stores/FilterTagStore');
var FilterActions = require('actions/FilterActions');
var FilterTagsActions = require('actions/FilterTagsActions');
var AppConstants = require('constants/AppConstants');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var MapAPI = require('utils/MapAPI');
var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');

var highlightStyle = {
  color: '#2262CC',
  weight: 3,
  opacity: 0.6,
  fillOpacity: 0.65,
  fillColor: '#2262CC'
};
var _map = null;
var _geoJSONLayer = null;
var _heat = null;
var _layers = {};
var _baseLayers = {};
var _normalStyle = {'fillColor': '#eeffee', 'fillOpacity': 0.0, 'weight': 2};
var _types = ['police-districts', 'wards', 'police-beats', 'neighborhoods'];

var selectedLayers = {};
var allLayersIndex = {};
var _maxBounds = {};
var _defaultBounds = {};
var Map;

require('mapbox.js');
require('leaflet.heat');
L.mapbox.accessToken = AppConstants.MAP_TOKEN;


Map = React.createClass({
  propTypes: {
    center: PropTypes.array,
    defaultZoom: PropTypes.number
  },

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

  componentDidMount: function () {
    var self = this;
    this.onDataToolInit();

    MapStore.addChangeMarkerListener(this.changeMarker);
    MapStore.addBeforeChangeMarkerListener(this.beforeChangeMarker);

    FilterTagStore.addChangeListener(this._onChange);
    this.embedListener();

    // having this code async will not block the immediate rendering of the page
    // on reload. On first load the API needs to be hit so the markers/areas don't block rendering
    // but on coming back via routing the data is cached and is parsed/loaded immediately blocking
    // the browser from painting.
    setTimeout(function () {
      MapAPI.getMarkers(self.props.query);
    }, 200);
  },

  componentWillUnmount: function () {
    MapStore.removeChangeMarkerListener(this.changeMarker);
    MapStore.removeBeforeChangeMarkerListener(this.beforeChangeMarker);
    FilterTagStore.removeChangeListener(this._onChange);

    _baseLayers = {};
    this.firstLayerAdded = false;
    this.removeEmbedListener();
  },

  // end embedding
  onDataToolInit: function () {
    this.create();
    this.createAreas();
    this.changeMarker();
  },

  onEachFeature: function (feature, layer) {
    var filter = FilterTagStore.getFilter('allegation__areas__id', feature.properties.id);
    var areaType, tagValue;

    layer.selected = false;

    if (filter) {
      layer.selected = true;
      layer.setStyle(highlightStyle);

      selectedLayers[feature.properties.id] = layer;
    }

    allLayersIndex[feature.properties.id] = layer;

    areaType = feature.properties.type;
    layer.on('mouseover', function () {
      $('.leaflet-control-command-interior').show().text(feature.properties.name);
      layer.setStyle(highlightStyle);
    });

    layer.on('mouseout', function () {
      $('.leaflet-control-command-interior').hide().text('');
      if (!layer.selected) {
        layer.setStyle(_normalStyle);
      }
    });

    // Generate tagValue on server instead
    tagValue = FilterTagStore.generateTagValue(
      'allegation__areas__id', feature.properties.id,
      'Area', areaType + ': ' + feature.properties.name
    );

    layer.on('click', function () {
      selectedLayers[feature.properties.id] = layer;
      layer.selected = !layer.selected;
      if (layer.selected) {
        FilterTagsActions.addTag(tagValue);
      }
      else {
        FilterTagsActions.removeTag(tagValue.category, tagValue.value);
      }
    });
    if (!(areaType in _layers)) {
      _layers[areaType] = L.layerGroup();
      _baseLayers[prettyLabels(areaType).capitalize()] = _layers[areaType];
      if (!this.firstLayerAdded && areaType == 'police-districts') {
        this.firstLayerAdded = true;
        _map.addLayer(_baseLayers[prettyLabels(areaType).capitalize()]);
      }

    }
    _layers[areaType].addLayer(layer);

  },

  getAreaBoundaries: function (type) {
    var that = this;
    $.get('/api/areas/?type=' + type, function (data) {
      var nextTypeIndex;

      that.firstLayerAdded = false;
      _geoJSONLayer = L.geoJson(data, {
        pointToLayer: L.mapbox.marker.style,
        style: function (feature) {
          return _normalStyle;
        },
        onEachFeature: that.onEachFeature
      });
      nextTypeIndex = _types.indexOf(type) + 1;
      if (_types[nextTypeIndex]) {
        that.getAreaBoundaries(_types[nextTypeIndex]);
      }
      else {
        L.control.layers(_baseLayers,{}, {collapsed: false}).addTo(_map);
        that._onChange();
      }
    }, 'json').fail(function (jqxhr, textStatus, error) {
    });
  },

  // embedding
  getEmbedCode: function () {
    var node = ReactDOM.findDOMNode(this);
    var width = $(node).width() + 2;
    var height = $(node).height() + 2;
    var src = '/embed/?page=map&query='
      + encodeURIComponent(AllegationFilterTagsQueryBuilder.buildQuery());
    var state = MapStore.getState();
    state = {
      center: state.center,
      defaultZoom: state.defaultZoom
    };
    src += '&state=' + encodeURIComponent(JSON.stringify(state));
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },

  getEmbedNode: function () {
    this.embedNode = this.embedNode || $('<div class="embed-code"></div>');
    this.embedNode.append('<i class="fa fa-code"></i>');
    this.embedNode.append('<input type="text" value="" readonly="readonly" />');

    this.embedNode.find('input').on('click', function (e) {
      e.preventDefault();
      $(this).select();
    }).val(this.getEmbedCode());
    return this.embedNode;
  },

  setMarkers: function (markers) {
    var latLngs, features, heatOpts;

    if (!markers) {
      return;
    }

    latLngs = [];
    features = markers.features;
    heatOpts = { radius: 10, max: this.mapIntensity(features.length) };
    if (typeof(HEATMAP_OVERRIDES) != 'undefined') {
      heatOpts = HEATMAP_OVERRIDES;
    }

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
          latLngs.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        }
      }
    });
    _heat = L.heatLayer(latLngs, heatOpts);
    _map.addLayer(_heat);

  },

  _onChange: function () {
    var filters = FilterTagStore.getFilters();
    var k, layer, bounds, hasOneSelected;

    if (!filters['allegation__areas__id'] || filters['allegation__areas__id'].length == 0) {
      _map.fitBounds(_defaultBounds);
      return;
    }


    for (k in allLayersIndex) {
      layer = allLayersIndex[k];
      if (!FilterTagStore.getFilter('allegation__areas__id', layer.feature.properties.id)) {
        layer.selected = false;
        layer.setStyle(_normalStyle);
        if (k in selectedLayers) {
          delete selectedLayers[k];
        }
      } else {
        layer.selected = true;
        layer.setStyle(highlightStyle);
        selectedLayers[k] = layer;
      }
    }

    bounds = L.latLngBounds([]);
    hasOneSelected = false;
    for (k in selectedLayers) {
      hasOneSelected = true;
      bounds.extend(selectedLayers[k].getBounds());
    }
    if (hasOneSelected) {
      _map.fitBounds(bounds);
    }
    else if (_defaultBounds) {
      _map.fitBounds(_defaultBounds);
    }

  },

  beforeChangeMarker: function () {
    if (_heat) {
      _map.removeLayer(_heat);
    }
  },

  changeMarker: function () {
    this.setMarkers(MapStore.getMarkers());
  },

  create: function (domId, opts) {
    var defaultZoom, center, southWest, northEast;

    this.firstLayerAdded = false;
    _layers = {};
    domId = domId ? domId : ReactDOM.findDOMNode(this);
    opts = opts ? opts : this.state;
    defaultZoom = opts.defaultZoom ? opts['defaultZoom'] : 11;
    center = opts.center ? opts['center'] : [41.85677, -87.6024055];

    southWest = L.latLng(41.143501411390766, -88.53057861328125);
    northEast = L.latLng(42.474122772511485, -85.39947509765625);
    _maxBounds = L.latLngBounds(southWest, northEast);
    _map = L.mapbox.map(domId, AppConstants.MAP_TYPE, opts).setView(center, defaultZoom);
    _defaultBounds = _map.getBounds();
    _map.setMaxBounds(_maxBounds);

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
    var areaHover;

    if (_geoJSONLayer) {
      _map.removeLayer(_geoJSONLayer);
    }
    if (typeof(HIGHLIGHT_STYLE) != 'undefined') {
      highlightStyle = HIGHLIGHT_STYLE;
    }
    if (typeof(NORMAL_STYLE) != 'undefined') {
      _normalStyle = NORMAL_STYLE;
    }

    this.getAreaBoundaries(_types[0]);

    L.Control.Command = L.Control.extend({
      options: {
        position: 'topright'
      },

      onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
        var controlUI;

        L.DomEvent
              .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
              .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
          .addListener(controlDiv, 'click', function () { MapShowCommand(); });

        controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
        controlUI.title = '';
        return controlDiv;
      }
    });
    L.control.command = function (options) {
      return new L.Control.Command(options);
    };
    areaHover = new L.Control.Command();
    _map.addControl(areaHover);
  },

  enterEmbedMode: function () {
    var node = ReactDOM.findDOMNode(this);
    var parent = $(node).parent();
    $(parent).prepend(this.getEmbedNode());
  },

  leaveEmbedMode: function () {
    this.removeEmbedNode();
  },

  mapIntensity: function (markersLength) {
    var intensity = 1;
    if (markersLength < 15000 ) {
      intensity = markersLength / 15000;
    }
    return intensity;
  },

  removeEmbedNode: function () {
    this.getEmbedNode().remove();
    this.embedNode = null;
  },

  render: function () {
    return <div id='map' className='pin-top pin-bottom'></div>;
  }
});

module.exports = Map;
