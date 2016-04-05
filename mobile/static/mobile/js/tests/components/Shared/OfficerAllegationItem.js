var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var sinon = require('sinon');

var HashUtil = require('utils/HashUtil');
var f = require('utils/tests/f');
var u = require('utils/HelperUtil');

var AppHistory = require('utils/History');
var OfficerAllegationItem = require('components/Shared/OfficerAllegationItem.react');
var ComplaintPageActions = require('actions/ComplaintPage/ComplaintPageActions');


describe('OfficerAllegationItemComponent', function () {
  it('should show correct information', function () {
    var crid = 1234;
    var date = '2012-01-19T09:11:00';
    var expectedDate = 'Jan 19, 2012';
    var category = f.create('Category', {'category': 'cat 1', 'allegation_name': 'allegation name'});

    var allegation = f.create('Allegation', {'crid': crid, 'incident_date': date});
    var officer = f.create('Officer', {'officer_first': 'John', 'officer_last': 'Terry'});
    // sorry for laziness
    var officerAllegations = f.createBatch(2, 'OfficerAllegation', {
      'officer': officer,
      'final_finding': 'un',
      'cat': category
    });
    var firstOfficerAllegation = officerAllegations[0];

    var officerAllegationItem = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationItem officerAllegation={ firstOfficerAllegation }
        allegation={ allegation } officerAllegations={ officerAllegations }/>
    );

    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'crid-number')
      .textContent.should.containEql(crid);
    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'final-finding')
      .textContent.should.containEql('Unfounded');
    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'category')
      .textContent.should.containEql('cat 1');
    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'sub-category')
      .textContent.should.containEql('allegation name');
    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'related-info')
      .textContent.should.containEql(expectedDate);
    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'related-info')
      .textContent.should.containEql('John Terry');
    ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'related-info')
      .textContent.should.containEql('and 1 other');
  });

  it('should push url to `AppHistory` and trigger toggle close when clicking', function () {
    var officerAllegationItem, node;
    var crid = 1234;
    var categoryHashId = HashUtil.encode(1);
    var category = f.create('Category', {id: 1, 'allegation_name': 'category name'});

    var expectedUrl = u.format('/complaint/1234/category-name/{categoryHash}', {'categoryHash': categoryHashId});
    var allegation = f.create('Allegation', {'crid': crid});
    var officerAllegation = f.create('OfficerAllegation', {'cat': category});

    var mockAppHistory = sinon.mock(AppHistory);
    var mockComplaintPageAction = sinon.mock(ComplaintPageActions);

    mockAppHistory.expects('pushState').once().withArgs(null, expectedUrl).returns(null);
    mockComplaintPageAction.expects('resetState').once().returns(null);

    officerAllegationItem = ReactTestUtils.renderIntoDocument(
      <OfficerAllegationItem officerAllegation={ officerAllegation } allegation={ allegation }
        officerAllegations={ [officerAllegation] }/>
    );
    node = ReactTestUtils.findRenderedDOMComponentWithClass(officerAllegationItem, 'officer-complaint-item');

    ReactTestUtils.Simulate.click(node);

    mockAppHistory.verify();
    mockComplaintPageAction.verify();

    mockAppHistory.restore();
    mockComplaintPageAction.restore();
  });
});
