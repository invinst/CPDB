var ReactTestUtils, Map, f;

var React = require('react');
ReactTestUtils = require('react-addons-test-utils');

require('should');

f = require('utils/tests/f');

Map = require('components/ComplaintPage/Location/Map.react');


describe('MapComponent', function () {
  it('should be renderable', function () {
    Map.should.be.renderable();
  });

  it('should render nothing if point is empty', function () {
    var allegation = f.create('Allegation', {'point': ''});
    var map = ReactTestUtils.renderIntoDocument(
      <Map allegation={ allegation } />
    );
    map.should.renderNothing();
  });

  it('should render exact location if have any', function () {
    var point = f.create('Point');
    var allegation = f.create('Allegation', {'point': point, 'add1': 'add1', 'add2': 'add2'});

    var map = ReactTestUtils.renderIntoDocument(
      <Map allegation={ allegation } />
    );
    map = ReactTestUtils.findRenderedDOMComponentWithClass(map, 'map');
    map.getElementsByClassName('leaflet-marker-icon').should.have.length(1);
  });

  it('should show a popup if there\'s no exact location', function () {
    var overlayPane;
    var point = f.create('Point');
    var allegation = f.create('Allegation', {'point': point, 'add1': '', 'add2': ''});

    var map = ReactTestUtils.renderIntoDocument(
      <Map allegation={ allegation } />
    );
    map = ReactTestUtils.findRenderedDOMComponentWithClass(map, 'map');
    overlayPane = map.getElementsByClassName('leaflet-overlay-pane')[0];
    overlayPane.getElementsByTagName('svg').should.have.length(1);
  });
});
