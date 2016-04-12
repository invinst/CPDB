var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var DOMUtils = require('utils/DOMUtils');

require('should');


describe('DOMUtils', function () {
  describe('getElementWidth', function () {
    it('should return correct element width', function () {
      var component = ReactTestUtils.renderIntoDocument(
        <div>testing</div>
      );
      var element = ReactDOM.findDOMNode(component);

      sinon.stub(DOMUtils, 'getComputedStyle', function () {
        return {
          width: '130px',
          paddingRight: '20px',
          paddingLeft: '10px'
        };
      });
      DOMUtils.getElementWidth(element).should.equal(100);
      DOMUtils.getComputedStyle.restore();
    });
  });
});
