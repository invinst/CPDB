var sinon, DeviceUtil, DocumentLink;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

require('should');
sinon = require('sinon');

require('utils/tests/should/React');
DeviceUtil = require('utils/DeviceUtil');

DocumentLink = require('components/ComplaintPage/DocumentLink.react');


describe('DocumentLinkComponent', function () {
  var documentLink;

  it('should be renderable', function () {
    documentLink = ReactTestUtils.renderIntoDocument(
      <DocumentLink/>
    );

    documentLink.should.be.ok;
  });

  it('should be return pdf link if iOS device', function () {
    var documentId = '12345';
    var documentNormalizedTitle = 'cr-123456';
    var expectedLink = 'http://documentcloud.org/documents/12345-cr-123456.pdf';
    var link;

    sinon.stub(DeviceUtil, 'isiOSDevice', function () { return true; });
    documentLink = ReactTestUtils.renderIntoDocument(
      <DocumentLink documentId={ documentId } documentNormalizedTitle={ documentNormalizedTitle }/>
    );
    link = ReactTestUtils.findRenderedDOMComponentWithClass(documentLink, 'document-link');

    link.textContent.should.be.eql('View documents');
    link.getAttribute('href').should.be.equal(expectedLink);

    DeviceUtil.isiOSDevice.restore();
  });

  it('should be return cloud link if other devices', function () {
    var documentId = '12345';
    var documentNormalizedTitle = 'cr-123456';
    var expectedLink = 'http://documentcloud.org/documents/12345-cr-123456.html';
    var link;

    sinon.stub(DeviceUtil, 'isiOSDevice', function () { return false; });
    documentLink = ReactTestUtils.renderIntoDocument(
      <DocumentLink documentId={ documentId } documentNormalizedTitle={ documentNormalizedTitle }/>
    );
    link = ReactTestUtils.findRenderedDOMComponentWithClass(documentLink, 'document-link');
    link.textContent.should.be.eql('View documents');
    link.getAttribute('href').should.be.equal(expectedLink);

    DeviceUtil.isiOSDevice.restore();
  });

  it('should be empty if no document Id', function () {
    documentLink = ReactTestUtils.renderIntoDocument(
      <DocumentLink />
    );

    documentLink.should.renderNothing();
  });
});
