var f, ComplainingWitness;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

require('should');

f = require('utils/tests/f');
require('utils/tests/should/React');

ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');


describe('ComplainingWitnessComponent', function () {
  var complainingWitness;

  it('should be renderable', function () {
    ComplainingWitness.should.be.renderable();
  });

  it('should show number of complaining witness', function () {
    var numberOfWiness = 2;
    var witnesses = f.createBatch(numberOfWiness, 'ComplainingWitness');
    complainingWitness = ReactTestUtils.renderIntoDocument(
      <ComplainingWitness complainingWitnesses={ witnesses }/>
    );
    ReactTestUtils.findRenderedDOMComponentWithClass(complainingWitness, 'title-count')
      .textContent.should.containEql(numberOfWiness);
  });

  it('should render complaining witness list', function () {
    var numberOfWiness = 2;
    var witnesses = f.createBatch(numberOfWiness, 'ComplainingWitness');
    complainingWitness = ReactTestUtils.renderIntoDocument(
      <ComplainingWitness complainingWitnesses={ witnesses }/>
    );
    ReactTestUtils.scryRenderedDOMComponentsWithClass(complainingWitness, 'complaining-witness-row')
      .length.should.be.equal(numberOfWiness);
  });

  it('should render nothing when there is no complaining witness', function () {
    complainingWitness = ReactTestUtils.renderIntoDocument(
      <ComplainingWitness />
    );
    complainingWitness.should.renderNothing();
  });

  it('should show information about witness\'s gender, race, age', function () {
    var complainingWitness = f.create('ComplainingWitness', {'gender': 'M', 'race': 'Black', 'age': 40});
    var expectedDescription = 'Male, Black, Age 40';

    complainingWitness = ReactTestUtils.renderIntoDocument(
      <ComplainingWitness complainingWitnesses={ [complainingWitness] }/>
    );
    ReactTestUtils.findRenderedDOMComponentWithClass(complainingWitness, 'complaining-witness-list')
      .textContent.should.containEql(expectedDescription);
  });

  it('should show `Gender unknown` if there is no gender', function () {
    var complainingWitness = f.create('ComplainingWitness', {'gender': ''});

    complainingWitness = ReactTestUtils.renderIntoDocument(
      <ComplainingWitness complainingWitnesses={ [complainingWitness] }/>
    );
    ReactTestUtils.findRenderedDOMComponentWithClass(complainingWitness, 'complaining-witness-list')
      .textContent.should.containEql('Gender unknown');
  });

  it('should show `Age unknown` if there is no age', function () {
    var complainingWitness = f.create('ComplainingWitness', {'age': ''});

    complainingWitness = ReactTestUtils.renderIntoDocument(
      <ComplainingWitness complainingWitnesses={ [complainingWitness] }/>
    );
    ReactTestUtils.findRenderedDOMComponentWithClass(complainingWitness, 'complaining-witness-list')
      .textContent.should.containEql('Age unknown');
  });

  it('should show `Race unknown` if there is no race', function () {
    var complainingWitness = f.create('ComplainingWitness', {'race': ''});

    complainingWitness = ReactTestUtils.renderIntoDocument(
      <ComplainingWitness complainingWitnesses={ [complainingWitness] }/>
    );
    ReactTestUtils.findRenderedDOMComponentWithClass(complainingWitness, 'complaining-witness-list')
      .textContent.should.containEql('Race unknown');
  });

});

