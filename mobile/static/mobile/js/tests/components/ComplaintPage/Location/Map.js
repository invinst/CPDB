var ReactTestUtils, Map, MapFacade, f, sinon;

var React = require('react');
ReactTestUtils = require('react-addons-test-utils');

sinon = require('sinon');
require('should');

f = require('utils/tests/f');

MapFacade = require('utils/MapFacade');

Map = require('components/ComplaintPage/Location/Map.react');


describe('MapComponent', function () {
  beforeEach(function () {
    sinon.stub(MapFacade, 'initialize');
    sinon.stub(MapFacade, 'addAccidentPlaceMarker');
    sinon.stub(MapFacade, 'addNoAddressPopup');
  });

  afterEach(function () {
    MapFacade.initialize.restore();
    MapFacade.addAccidentPlaceMarker.restore();
    MapFacade.addNoAddressPopup.restore();
  });

  it('should be renderable', function () {
    Map.should.be.renderable();
  });

  it('should render nothing if point is empty', function () {
    var allegation = f.create('Allegation', {'point': ''});
    ReactTestUtils.renderIntoDocument(
      <Map allegation={ allegation } />
    );

    MapFacade.initialize.called.should.be.false();
  });

  it('should render exact location if have any', function () {
    var point = f.create('Point');
    var allegation = f.create('Allegation', {'point': point, 'add1': 'add1', 'add2': 'add2'});

    ReactTestUtils.renderIntoDocument(
      <Map allegation={ allegation } />
    );

    MapFacade.initialize.called.should.be.true();
    MapFacade.addAccidentPlaceMarker.called.should.be.true();
    MapFacade.addNoAddressPopup.called.should.be.false();
  });

  it('should show a popup if there\'s no exact location', function () {
    var point = f.create('Point');
    var allegation = f.create('Allegation', {'point': point, 'add1': '', 'add2': ''});

    ReactTestUtils.renderIntoDocument(
      <Map allegation={ allegation } />
    );

    MapFacade.initialize.called.should.be.true();
    MapFacade.addNoAddressPopup.called.should.be.true();
    MapFacade.addAccidentPlaceMarker.called.should.be.false();
  });
});
