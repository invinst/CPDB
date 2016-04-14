var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var Searchable = require('components/Shared/SearchablePage.react');

var SharedExample = require('utils/tests/SharedExample');

SharedExample.define('a searchable page', function () {
  var self = this;

  it('should render search page', function () {
    var element = ReactTestUtils.renderIntoDocument(
      React.createElement(self.obj)
    );

    element.setState({'loading': false, 'found': true});

    element.should.render([Searchable]);

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(element).parentNode);
  });
});
