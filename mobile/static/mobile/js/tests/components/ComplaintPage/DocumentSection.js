var DocumentSection, DocumentCard, f;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

require('should');

f = require('utils/tests/f');
require('utils/tests/should/React');

DocumentSection = require('components/ComplaintPage/DocumentSection.react');
DocumentCard = require('components/ComplaintPage/DocumentSection/DocumentCard.react');


describe('DocumentSectionComponent', function () {
  var documentSection;

  it('should be renderable', function () {
    DocumentSection.should.be.renderable();
  });

  it('should render nothing if there is no documents', function () {
    documentSection = ReactTestUtils.renderIntoDocument(
      <DocumentSection/>
    );
    documentSection.should.renderNothing();
  });

  it('should show number of documents', function () {
    var headerNode;
    var documents = f.createBatch(2, 'Document');
    documentSection = ReactTestUtils.renderIntoDocument(
      <DocumentSection documents={ documents } />
    );

    headerNode = ReactTestUtils.findRenderedDOMComponentWithClass(documentSection, 'section-title');
    headerNode.textContent.should.containEql('2');
  });

  it('should render list of DocumentCard', function () {
    var documents = f.createBatch(2, 'Document');

    documentSection = ReactTestUtils.renderIntoDocument(
      <DocumentSection documents={ documents } />
    );

    ReactTestUtils.scryRenderedComponentsWithType(documentSection, DocumentCard).length.should.be.equal(2);
  });

});
