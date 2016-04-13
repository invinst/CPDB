var ReactTestUtils, NotMatchedCategoryPage, HashUtil;

var React = require('react');
ReactTestUtils = require('react-addons-test-utils');

require('should');

require('utils/tests/should/React');
HashUtil = require('utils/HashUtil');
require('utils/tests/should/SharedExample');
require('tests/examples/components/SearchablePage');

NotMatchedCategoryPage = require('components/ComplaintPage/NotMatchedCategoryPage.react');


describe('NotMatchedCategoryPageComponent', function () {
  var notMatchedCategoryPage;

  it('should be renderable', function () {
    NotMatchedCategoryPage.should.be.renderable();
  });

  it('should render the message with decoded categoryId', function () {
    var categoryId = 12345;
    var categoryHashId = HashUtil.encode(categoryId);

    notMatchedCategoryPage = ReactTestUtils.renderIntoDocument(
      <NotMatchedCategoryPage category={ categoryHashId }/>
    );
    ReactTestUtils.findRenderedDOMComponentWithClass(notMatchedCategoryPage, 'message-content')
      .textContent.should.containEql(categoryId);
  });

  describe('should act like a searchable page', function () {
    (function () {
      return ReactTestUtils.renderIntoDocument(
        <NotMatchedCategoryPage />
      );
    }).should.behaveLike('a searchable page');
  });
});
