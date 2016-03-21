var _ = require('lodash');
var ReactTestUtils = require('react-addons-test-utils');


var getElementsAttributeByTagName = function (component, tagName, key) {
  return _.map(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, tagName), function (el) {
    return el.getAttribute(key);
  });
};

var getElementsAttributeByClassName = function (component, className, key) {
  return _.map(ReactTestUtils.scryRenderedDOMComponentsWithClass(component, className), function (el) {
    return el.getAttribute(key);
  });
};

var getElementsTextByClassName = function (component, className) {
  return _.map(ReactTestUtils.scryRenderedDOMComponentsWithClass(component, className), function (el) {
    return el.textContent;
  });
};

module.exports = {
  getElementsAttributeByTagName: getElementsAttributeByTagName,
  getElementsAttributeByClassName: getElementsAttributeByClassName,
  getElementsTextByClassName: getElementsTextByClassName
};
