var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var LoadingPage = require('components/Shared/LoadingPage.react');
var NotMatchedComplaintPage = require('components/ComplaintPage/NotMatchedComplaintPage.react');

var SharedExample = require('utils/tests/SharedExample');


SharedExample.define('a loadable page', function () {
  var self = this;

  it('should render loading page if loading is true', function () {
    var element = ReactTestUtils.renderIntoDocument(
      React.createElement(self.obj)
    );

    element.setState({'loading': true});

    element.should.render([LoadingPage]);

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(element).parentNode);
  });

  it('should render not matched page if data is not found', function () {
    var element = ReactTestUtils.renderIntoDocument(
      React.createElement(self.obj)
    );

    element.setState({'found': false, 'loading': false});

    element.should.render([NotMatchedComplaintPage]);

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(element).parentNode);
  });
});
