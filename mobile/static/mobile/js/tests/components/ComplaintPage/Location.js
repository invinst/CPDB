var ReactTestUtils, Location, Map, f;

var React = require('react');
require('react-dom');
ReactTestUtils = require('react-addons-test-utils');

require('should');

f = require('utils/tests/f');

Location = require('components/ComplaintPage/Location.react');
Map = require('components/ComplaintPage/Location/Map.react');


describe('LocationComponent', function () {
  var location;

  it('should be renderable', function () {
    location = ReactTestUtils.renderIntoDocument(
      <Location/>
    );
    location.should.be.ok;
  });

  it('should render Map as sub-component if allegation has point data', function () {
    var point = {'x': '-87.725233', 'y': '41.854405'};
    var allegation = f.create('Allegation', {'point': point});

    location = ReactTestUtils.renderIntoDocument(
      <Location allegation={ allegation }/>
    );
    ReactTestUtils.findRenderedComponentWithType(location, Map).should.be.ok;
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
