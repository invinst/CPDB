var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var f = require('utils/tests/f');

var Document = require('components/DataToolPage/Complaint/Document.react');
var Documents = require('components/DataToolPage/Complaint/Documents.react');

require('should');


describe('DocumentsComponent', function () {
  var documentsComponent;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(documentsComponent).parentNode);
  });

  it('is renderable', function () {
    documentsComponent = ReactTestUtils.renderIntoDocument(<Documents documents={ [] } />);
    documentsComponent.should.be.ok();
  });

  it('renders Document as sub-component', function () {
    var documents = f.createBatch(2, 'Document');

    documentsComponent = ReactTestUtils.renderIntoDocument(<Documents documents={ documents } />);
    ReactTestUtils.scryRenderedComponentsWithType(documentsComponent, Document).length.should.be.equal(2);
  });
});
