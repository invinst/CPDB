var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var f = require('utils/tests/f');
var Document = require('components/DataToolPage/Complaint/Document.react');

describe('DocumentComponent', function () {
  var documentComponent;

  it('is renderable', function () {
    documentComponent = ReactTestUtils.renderIntoDocument(<Document document={ {} } />);
    documentComponent.should.be.ok();
  });

  it('should render document title', function () {
    var document = f.create('Document', { type: 'CR' });
    documentComponent = ReactTestUtils.renderIntoDocument(<Document document={ document } />);

    ReactTestUtils.findRenderedDOMComponentWithClass(documentComponent, 'document-title').textContent
      .should.be.equal('Investigation report');
  });

  it('should render document status', function () {
    var document = f.create('Document', { documentcloud_id: 1 });

    documentComponent = ReactTestUtils.renderIntoDocument(<Document document={ document } />);
    ReactTestUtils.findRenderedDOMComponentWithClass(documentComponent, 'document-status').textContent
      .should.be.equal('Available');
  });
});
