var ReactTestUtils, NotMatchedOfficerPage;

var React = require('react');
ReactTestUtils = require('react-addons-test-utils');

require('should');

require('utils/tests/should/React');
require('utils/tests/should/SharedExample');
require('tests/examples/components/SearchablePage');

NotMatchedOfficerPage = require('components/OfficerPage/NotMatchedOfficerPage.react');


describe('NotMatchedOfficerPageComponent', function () {
  var notMatchedOfficerPage;

  it('should be renderable', function () {
    NotMatchedOfficerPage.should.be.renderable();
  });

  it('should render the message with decoded categoryId', function () {
    var id = 12345;

    notMatchedOfficerPage = ReactTestUtils.renderIntoDocument(
      <NotMatchedOfficerPage id={ id }/>
    );
    ReactTestUtils.findRenderedDOMComponentWithClass(notMatchedOfficerPage, 'message-content')
      .textContent.should.containEql(id);
  });

  describe('should act like a searchable page', function () {
    (function () {
      return ReactTestUtils.renderIntoDocument(
        <NotMatchedOfficerPage />
      );
    }).should.behaveLike('a searchable page');
  });
});
