var ReactTestUtils, f, DocumentLink, OfficerAllegationDetail, cridInfo;

var React = require('react');
require('react-dom');
ReactTestUtils = require('react-addons-test-utils');

require('should');
f = require('utils/tests/f');

DocumentLink = require('components/ComplaintPage/DocumentLink.react');
OfficerAllegationDetail = require('components/ComplaintPage/OfficerAllegationDetail.react');


describe('OfficerAllegationDetailComponent', function () {
  var officerAllegationDetail;

  it('should be renderable', function () {
    officerAllegationDetail = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationDetail/>
    );
    officerAllegationDetail.should.be.ok;
  });

  it('should display the crid information', function () {
    var allegation = f.create('Allegation');

    officerAllegationDetail = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationDetail allegation={ allegation } />
    );

    cridInfo = ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationDetail, 'crid-info');
    cridInfo.textContent.should.be.containEql(allegation.crid);
  });

  it('should display Unknown if there is no crid information', function () {
    var allegation = f.create('Allegation', { 'crid': null });

    officerAllegationDetail = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationDetail allegation={ allegation } />
    );

    cridInfo = ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationDetail, 'crid-info');
    cridInfo.textContent.should.be.containEql('Unknown');
  });

  it('should display the number of involved officers', function () {
    var numberOfAllegationNode;
    var numberOfAllegations = 5;

    officerAllegationDetail = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationDetail numberOfAllegations={ numberOfAllegations } />
    );

    numberOfAllegationNode = ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationDetail,
      'number-of-allegations');
    numberOfAllegationNode.textContent.should.be.containEql('5 complaints');
  });


  it('should display category and allegation name', function () {
    var categoryInfoNode = null;
    var allegationCategory = 'allegationCategory';
    var allegationName = 'allegationName';
    var category = f.create('Category', { 'category': allegationCategory, 'allegation_name': allegationName });
    var currentOfficerAllegation = f.create('OfficerAllegation', { 'cat': category });

    officerAllegationDetail = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationDetail currentOfficerAllegation={ currentOfficerAllegation } />
    );

    categoryInfoNode = ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationDetail,
      'category-info');
    categoryInfoNode.textContent.should.be.containEql(allegationCategory);
    categoryInfoNode.textContent.should.be.containEql(allegationName);
  });


  it('should display `Unknown` and hide allegation name if there is no category', function () {
    var currentOfficerAllegation = f.create('OfficerAllegation', { 'cat': null });

    officerAllegationDetail = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationDetail currentOfficerAllegation={ currentOfficerAllegation } />
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationDetail, 'allegation-category')
      .textContent.should.be.containEql('Unknown');
    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationDetail, 'allegation-name')
      .textContent.should.be.eql('');
  });

  it('should render `DocumentLink` as subcomponent', function () {
    var allegation = f.create('Allegation');

    officerAllegationDetail = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationDetail allegation={ allegation } />
    );

    ReactTestUtils.findRenderedComponentWithType(officerAllegationDetail, DocumentLink).should.be.ok;
  });
});
