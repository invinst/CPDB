var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var HorizontalPercentageChart = require('components/DataToolPage/HorizontalPercentageChart.react');
var RaceGenderAgeTab = require('components/DataToolPage/RaceGenderAgeTab.react');
var RaceGenderAgeTabStore = require('stores/DataToolPage/RaceGenderAgeTabStore');

require('should');


describe('RaceGenderAgeTab component', function () {
  var tab;
  var callback = AppDispatcher.getCallback(RaceGenderAgeTabStore.dispatcherToken);

  var receiveData = function (data) {
    callback({ actionType: AppConstants.RACE_GENDER_TAB_RECEIVED_DATA, data: data});
  };

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(tab).parentNode);
  });

  it('should display race/gender/age charts with officer role', function () {
    var charts;
    var data = {
      officers: {
        age: {
          '20-30': 8
        },
        gender: {
          'M': 9
        },
        race: {
          'White': 10
        }
      },
      'complaining_witness': {
        age: {},
        gender: {},
        race: {}
      }
    };

    tab = ReactTestUtils.renderIntoDocument(
      <RaceGenderAgeTab
        role={ RaceGenderAgeTab.OFFICER_ROLE } />
    );

    receiveData(data);

    charts = ReactTestUtils.scryRenderedComponentsWithType(tab, HorizontalPercentageChart);
    charts.length.should.equal(3);

    ReactTestUtils.findRenderedDOMComponentWithClass(charts[0], 'chart-label').textContent
      .should.equal('Race');
    ReactTestUtils.findRenderedDOMComponentWithClass(charts[0], 'segment-name').textContent
      .should.equal('White officers');

    ReactTestUtils.findRenderedDOMComponentWithClass(charts[1], 'chart-label').textContent
      .should.equal('Gender');
    ReactTestUtils.findRenderedDOMComponentWithClass(charts[1], 'segment-name').textContent
      .should.equal('Male');

    ReactTestUtils.findRenderedDOMComponentWithClass(charts[2], 'chart-label').textContent
      .should.equal('Age');
    ReactTestUtils.findRenderedDOMComponentWithClass(charts[2], 'segment-name').textContent
      .should.equal('20-30');
  });

  it('should display race/gender/age charts with complainant role', function () {
    var charts;
    var data = {
      officers: {
        age: {},
        gender: {},
        race: {}
      },
      'complaining_witness': {
        age: {
          '31-40': 1
        },
        gender: {
          'F': 2
        },
        race: {
          'Black': 3
        }
      }
    };

    tab = ReactTestUtils.renderIntoDocument(
      <RaceGenderAgeTab
        role={ RaceGenderAgeTab.COMPLAINANT_ROLE } />
    );

    receiveData(data);

    charts = ReactTestUtils.scryRenderedComponentsWithType(tab, HorizontalPercentageChart);
    charts.length.should.equal(3);

    ReactTestUtils.findRenderedDOMComponentWithClass(charts[0], 'chart-label').textContent
      .should.equal('Race');
    ReactTestUtils.findRenderedDOMComponentWithClass(charts[0], 'segment-name').textContent
      .should.equal('Black');

    ReactTestUtils.findRenderedDOMComponentWithClass(charts[1], 'chart-label').textContent
      .should.equal('Gender');
    ReactTestUtils.findRenderedDOMComponentWithClass(charts[1], 'segment-name').textContent
      .should.equal('Female');

    ReactTestUtils.findRenderedDOMComponentWithClass(charts[2], 'chart-label').textContent
      .should.equal('Age');
    ReactTestUtils.findRenderedDOMComponentWithClass(charts[2], 'segment-name').textContent
      .should.equal('31-40');
  });
});
