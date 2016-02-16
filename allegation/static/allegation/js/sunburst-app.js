var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var SunburstChartLegend = require('./components/DataToolPage/Sunburst/SunburstChartLegend.react');
var SunburstActions = require('./actions/SunburstActions');


global.initReact = function () {
  var element = document.getElementById('root');

  AppDispatcher.dispatch({
    actionType: AppConstants.RECEIVED_SESSION_DATA,
    data: { data: {
      'sunburst_arc': window.SUNBURST_ARC,
      query: {}
    }}
  });

  ReactDOM.render(
    <SunburstChartLegend data={ window.SUNBURST_DATA.sunburst } />,
    element
  );

  SunburstActions.receivedData(window.SUNBURST_DATA);
};
