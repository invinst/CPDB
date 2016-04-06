var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var f = require('utils/tests/f');
var Document = require('components/DataToolPage/Complaint/Document.react');
var RequestDocumentActions = require('actions/RequestDocumentActions');

describe('DocumentComponent', function () {
  var documentComponent;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(documentComponent).parentNode);
  });

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
    var document = f.create('Document', { 'documentcloud_id': 1 });

    documentComponent = ReactTestUtils.renderIntoDocument(<Document document={ document } />);
    ReactTestUtils.findRenderedDOMComponentWithClass(documentComponent, 'document-status').textContent
      .should.be.equal('Available');
  });

  describe('render document action', function () {
    it('should render correctly for available document', function () {
      var document = f.create('Document', { 'documentcloud_id': 1, 'normalized_title': 'title' });
      var documentAction;

      documentComponent = ReactTestUtils.renderIntoDocument(<Document document={ document } />);
      documentAction = ReactTestUtils.findRenderedDOMComponentWithClass(documentComponent, 'document-action');
      documentAction.textContent.should.be.equal('View');
      documentAction.href.should.be.equal('http://documentcloud.org/documents/1-title.html');
    });

    it('should render correctly for pending document', function () {
      var document = f.create('Document', { 'requested': true, 'documentcloud_id': 0 });
      var documentAction;

      documentComponent = ReactTestUtils.renderIntoDocument(<Document document={ document } />);
      documentAction = ReactTestUtils.findRenderedDOMComponentWithClass(documentComponent, 'document-action');
      documentAction.textContent.should.be.equal('Follow');

      sinon.stub(RequestDocumentActions, 'request');
      ReactTestUtils.Simulate.click(documentAction);
      RequestDocumentActions.request.calledWith(document).should.be.true();
      RequestDocumentActions.request.restore();
    });

    it('should render correctly for missing document', function () {
      var document = f.create('Document', { 'requested': false, 'documentcloud_id': 0 });
      var documentAction;

      documentComponent = ReactTestUtils.renderIntoDocument(<Document document={ document } />);
      documentAction = ReactTestUtils.findRenderedDOMComponentWithClass(documentComponent, 'document-action');
      documentAction.textContent.should.be.equal('Request');

      sinon.stub(RequestDocumentActions, 'request');
      ReactTestUtils.Simulate.click(documentAction);
      RequestDocumentActions.request.calledWith(document).should.be.true();
      RequestDocumentActions.request.restore();
    });
  });
});
