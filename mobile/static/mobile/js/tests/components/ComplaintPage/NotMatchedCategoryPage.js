var ReactTestUtils, NotMatchedCategoryPage, HashUtil;

var React = require('react');
ReactTestUtils = require('react-addons-test-utils');

require('should');

HashUtil = require('utils/HashUtil');

NotMatchedCategoryPage = require('components/ComplaintPage/NotMatchedCategoryPage.react');


describe('NotMatchedCategoryPageComponent', function () {
  var notMatchedCategoryPage;

  it('should be renderable', function () {
    notMatchedCategoryPage = ReactTestUtils.renderIntoDocument(
      <NotMatchedCategoryPage />
    );
    notMatchedCategoryPage.should.be.ok;
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
});
