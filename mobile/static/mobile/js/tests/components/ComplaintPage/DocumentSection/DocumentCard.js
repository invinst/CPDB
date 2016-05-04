var DocumentCard, f, DeviceUtil, Modal, u, InterfaceTextResourceUtil;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var sinon = require('sinon');
require('should');

DeviceUtil = require('utils/DeviceUtil');
f = require('utils/tests/f');
require('utils/tests/should/React');
u = require('utils/HelperUtil');

DocumentCard = require('components/ComplaintPage/DocumentSection/DocumentCard.react');
Modal = require('components/Lib/Modal.react');
InterfaceTextResourceUtil = require('utils/InterfaceTextResourceUtil');


describe('DocumentCardComponent', function () {
  beforeEach(function () {
    sinon.stub(InterfaceTextResourceUtil, 'get', function () {});
  });

  afterEach(function () {
    InterfaceTextResourceUtil.get.restore();
  });

  it('should be renderable', function () {
    DocumentCard.should.be.renderable();
  });

  it('should render document name', function () {
    var document = f.create('Document', {'type': 'CR'});

    var documentCard = ReactTestUtils.renderIntoDocument(
      <DocumentCard document={ document } />
    );

    var documentNameNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'document-name');
    documentNameNode.textContent.should.containEql('Investigation report');
  });

  it('should render document status', function () {
    var document = f.create('Document', {'documentcloud_id': 'something'});

    var documentCard = ReactTestUtils.renderIntoDocument(
      <DocumentCard document={ document } />
    );

    var documentStatusNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'status');
    documentStatusNode.textContent.should.containEql('Available');
  });

  it('should render request modal', function () {
    var document = f.create('Document', {'documentcloud_id': 'something'});
    var modalName = u.format('requestModal-{id}', {'id': document.id});
    var documentCard = ReactTestUtils.renderIntoDocument(
      <DocumentCard document={ document } />
    );

    documentCard.should.renderWithProps(Modal, {'name': modalName});
  });

  describe('document name css', function () {
    it('should have blur css if the document is not available', function () {
      var document = f.create('Document', {'documentcloud_id': ''});
      var documentCard = ReactTestUtils.renderIntoDocument(
        <DocumentCard document={ document } />
      );

      var documentNameNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'document-name');

      documentNameNode.getAttribute('class').should.containEql('blur');
    });

    it('should not have blur css if the document is available', function () {
      var document = f.create('Document', {'documentcloud_id': 'something'});
      var documentCard = ReactTestUtils.renderIntoDocument(
        <DocumentCard document={ document } />
      );

      var documentNameNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'document-name');

      documentNameNode.getAttribute('class').should.not.containEql('blur');
    });
  });

  describe('Multiple document', function () {
    it('should show View action if the document is available', function () {
      var document = f.create('Document', {'documentcloud_id': '12345', 'normalized_title': 'cr-123456'});
      var documentUrl = 'http://documentcloud.org/documents/12345-cr-123456.html';

      var documentCard = ReactTestUtils.renderIntoDocument(
        <DocumentCard document={ document } />
      );

      var documentActionNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'action-type');
      documentActionNode.textContent.should.containEql('View');
      documentActionNode.getAttribute('href').should.containEql(documentUrl);
    });

    it('should show follow action if the document is requested but the document is still not available ', function () {
      var documentCard, documentActionNode;
      var document = f.create('Document', {'requested': true, 'documentcloud_id': ''});
      var modalName = u.format('requestModal-{id}', {'id': document.id});
      var mock = sinon.mock(Modal.eventSystem);
      mock.expects('dispatch').once().withArgs(modalName, 'open');

      documentCard = ReactTestUtils.renderIntoDocument(
        <DocumentCard document={ document } />
      );
      documentActionNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'action-type');

      ReactTestUtils.Simulate.click(documentActionNode);
      documentActionNode.textContent.should.containEql('Follow');

      mock.verify();
      mock.restore();
    });

    it('should show request action if the  document is still not available and not requested yet', function () {
      var documentCard, documentActionNode;
      var document = f.create('Document', {'requested': false, 'documentcloud_id': ''});
      var modalName = u.format('requestModal-{id}', {'id': document.id});

      var mock = sinon.mock(Modal.eventSystem);
      mock.expects('dispatch').once().withArgs(modalName, 'open');

      documentCard = ReactTestUtils.renderIntoDocument(
        <DocumentCard document={ document } />
      );
      documentActionNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'action-type');

      ReactTestUtils.Simulate.click(documentActionNode);
      documentActionNode.textContent.should.containEql('Request');

      mock.verify();
      mock.restore();
    });
  });

  describe('Document is available', function () {
    it('should show the link to html page of DocumentCloud if the current device is not iOS one', function () {
      var documentCard;
      var document = f.create('Document', {'documentcloud_id': '12345', 'normalized_title': 'cr-123456'});
      var expectedLink = 'http://documentcloud.org/documents/12345-cr-123456.html';
      var actionTypeNode;

      sinon.stub(DeviceUtil, 'isiOSDevice', function () { return false; });
      documentCard = ReactTestUtils.renderIntoDocument(
        <DocumentCard document={ document }/>
      );
      actionTypeNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'action-type');

      actionTypeNode.getAttribute('href').should.be.equal(expectedLink);
      DeviceUtil.isiOSDevice.restore();
    });

    it('should show the link to pdf page of DocumentCloud if the current device is iOS one', function () {
      var documentCard;
      var document = f.create('Document', {'documentcloud_id': '12345', 'normalized_title': 'cr-123456'});
      var expectedLink = 'http://documentcloud.org/documents/12345-cr-123456.pdf';
      var actionTypeNode;

      sinon.stub(DeviceUtil, 'isiOSDevice', function () { return true; });
      documentCard = ReactTestUtils.renderIntoDocument(
        <DocumentCard document={ document }/>
      );
      actionTypeNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentCard, 'action-type');

      actionTypeNode.getAttribute('href').should.be.equal(expectedLink);
      DeviceUtil.isiOSDevice.restore();
    });
  });
});
