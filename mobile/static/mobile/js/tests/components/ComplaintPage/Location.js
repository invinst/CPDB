var ReactTestUtils, Location, Map, MapFacade, f, sinon;

var React = require('react');
require('react-dom');
ReactTestUtils = require('react-addons-test-utils');

require('should');
sinon = require('sinon');

f = require('utils/tests/f');
require('utils/tests/should/React');
MapFacade = require('utils/MapFacade');


Location = require('components/ComplaintPage/Location.react');
Map = require('components/ComplaintPage/Location/Map.react');


describe('LocationComponent', function () {
  var location;

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
    Location.should.be.renderable();
  });

  it('should render Map as sub-component if allegation has point data', function () {
    var point = {'x': '-87.725233', 'y': '41.854405'};
    var allegation = f.create('Allegation', {'point': point});

    location = ReactTestUtils.renderIntoDocument(
      <Location allegation={ allegation }/>
    );

    location.should.render([Map]);
  });

  it('should show full address, beat, location type, city', function () {
    var add1 = 'add1';
    var add2 = 'add2';
    var beat = {'name': '0512'};
    var allegation = f.create('Allegation', {
      'add1': add1, 'add2': add2, 'beat': beat, 'city': 'CHICAGO IL', 'location': '17'
    });

    location = ReactTestUtils.renderIntoDocument(
      <Location allegation={ allegation }/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(location, 'location-detail')
      .textContent.should.containEql('add1 add2');
    ReactTestUtils.findRenderedDOMComponentWithClass(location, 'location-detail')
      .textContent.should.containEql('0512');
    ReactTestUtils.findRenderedDOMComponentWithClass(location, 'location-detail')
      .textContent.should.containEql('CHICAGO IL');
    ReactTestUtils.findRenderedDOMComponentWithClass(location, 'location-detail')
      .textContent.should.containEql('17');
  });

});
