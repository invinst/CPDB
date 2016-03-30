var sinon;
var f, HashUtil, GaUtil;
var AccompliceOfficerSection, AgainstSection, AllegationResourceUtil, ComplainingWitness, ComplaintPage,
  ComplaintPageStore, InvestigatorSection, Location, OfficerAllegationDetail, SearchablePage, ToggleComplaintPage;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

require('should');
sinon = require('sinon');

f = require('utils/tests/f');
HashUtil = require('utils/HashUtil');
GaUtil = require('utils/GaUtil');
require('utils/tests/should/SharedExample');
require('tests/examples/components/LoadablePage');
require('utils/tests/should/React');

AccompliceOfficerSection = require('components/ComplaintPage/AccompliceOfficerSection.react');
AgainstSection = require('components/ComplaintPage/AgainstSection.react');
AllegationResourceUtil = require('utils/AllegationResourceUtil');
ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');
ComplaintPage = require('components/ComplaintPage.react');
ComplaintPageStore = require('stores/ComplaintPage/ComplaintPageStore');
InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
Location = require('components/ComplaintPage/Location.react');
OfficerAllegationDetail = require('components/ComplaintPage/OfficerAllegationDetail.react');
SearchablePage = require('components/Shared/SearchablePage.react');
ToggleComplaintPage = require('components/ComplaintPage/ToggleComplaintPage.react');


function stubForComplaintPage() {
  sinon.stub(GaUtil, 'track');
  sinon.stub(AllegationResourceUtil, 'get');
}

function restoreForComplaintPage() {
  if (GaUtil.track.restore) {
    GaUtil.track.restore();
  }

  if (AllegationResourceUtil.get.restore) {
    AllegationResourceUtil.get.restore();
  }
}

describe('ComplaintPageComponent', function () {
  var complaintPage;

  beforeEach(function () {
    stubForComplaintPage();
  });

  afterEach(function () {
    if (ComplaintPageStore.getState.restore) {
      ComplaintPageStore.getState.restore();
    }

    if (complaintPage && complaintPage.isMounted()) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(complaintPage).parentNode);
    }

    restoreForComplaintPage();
  });

  it('should be renderable', function () {
    ComplaintPage.should.be.renderable();
  });

  it('should be tracked by google analytics', function () {
    var mock = sinon.mock(GaUtil);
    restoreForComplaintPage();
    sinon.stub(AllegationResourceUtil, 'get', function () {
    });

    mock.expects('track').once().withArgs('event', 'allegation', 'view_detail', '/').returns('anything');

    complaintPage = ReactTestUtils.renderIntoDocument(
      <ComplaintPage />
    );

    mock.verify();

    mock.restore();
    AllegationResourceUtil.get.restore();
  });

  describe('have enough data to render properly', function () {
    var data, officerAllegation, params, category;

    beforeEach(function () {
      var categoryId = 123;
      category = f.create('Category', {'id': categoryId});

      officerAllegation = f.create('OfficerAllegation', {'cat': category});
      data = f.create('ComplaintPageData', {'officer_allegations': [officerAllegation]});
      params = {
        'categoryHashId': HashUtil.encode(categoryId)
      };

      complaintPage = ReactTestUtils.renderIntoDocument(
        <ComplaintPage params={ params }/>
      );

      complaintPage.setState({'loading': false, 'found': true, 'data': data});
    });

    it('should render a list of sub-component', function () {

      complaintPage.should.render([SearchablePage, OfficerAllegationDetail, AgainstSection, ComplainingWitness,
        Location, AccompliceOfficerSection, InvestigatorSection]);
    });

    it('should render component with correct data for `AgainstSection` and `AccompliceOfficerSection`', function () {
      var otherCategory = f.create('Category', {'id': 456});
      var otherOfficerAllegation = f.create('OfficerAllegation', {'cat': otherCategory});
      data = f.create('ComplaintPageData', {'officer_allegations': [officerAllegation, otherOfficerAllegation]});

      complaintPage = ReactTestUtils.renderIntoDocument(
        <ComplaintPage params={ params }/>
      );

      complaintPage.setState({'loading': false, 'found': true, 'data': data});
      complaintPage.should.renderWithProps(AgainstSection, {'officerAllegations': [officerAllegation]});
      complaintPage.should.renderWithProps(AccompliceOfficerSection, {'officerAllegations': [otherOfficerAllegation]});
    });

    it('should render component with sorted data for `AccompliceOfficerSection`', function () {
      var otherCategory = f.create('Category', {'id': 456});

      var officer1 = f.create('Officer', {'allegations_count': 1});
      var officer2 = f.create('Officer', {'allegations_count': 2});
      var officer3 = f.create('Officer', {'allegations_count': 3});

      var officerAllegation1 = f.create('OfficerAllegation', {'cat': otherCategory, 'officer': officer1});
      var officerAllegation2 = f.create('OfficerAllegation', {'cat': otherCategory, 'officer': officer2});
      var officerAllegation3 = f.create('OfficerAllegation', {'cat': otherCategory, 'officer': officer3});

      data = f.create('ComplaintPageData', {
        'officer_allegations': [officerAllegation, officerAllegation3,
          officerAllegation1, officerAllegation2]
      });

      complaintPage = ReactTestUtils.renderIntoDocument(
        <ComplaintPage params={ params }/>
      );

      complaintPage.setState({'loading': false, 'found': true, 'data': data});
      complaintPage.should.renderWithProps(AgainstSection, {'officerAllegations': [officerAllegation]});
      complaintPage.should.renderWithProps(AccompliceOfficerSection, {
        'officerAllegations': [officerAllegation3,
          officerAllegation2, officerAllegation1]
      });
    });

    it('should render component with sorted data for `AgainstOfficerSection`', function () {
      var otherCategory = f.create('Category', {'id': 456});

      var officer1 = f.create('Officer', {'allegations_count': 1});
      var officer2 = f.create('Officer', {'allegations_count': 2});
      var officer3 = f.create('Officer', {'allegations_count': 3});

      var officerAllegation1 = f.create('OfficerAllegation', {'cat': category, 'officer': officer1});
      var officerAllegation2 = f.create('OfficerAllegation', {'cat': category, 'officer': officer2});
      var officerAllegation3 = f.create('OfficerAllegation', {'cat': category, 'officer': officer3});

      var otherOfficerAllegation = f.create('OfficerAllegation', {'cat': otherCategory, 'officer': officer3});

      data = f.create('ComplaintPageData', {
        'officer_allegations': [otherOfficerAllegation, officerAllegation3,
          officerAllegation1, officerAllegation2]
      });

      complaintPage = ReactTestUtils.renderIntoDocument(
        <ComplaintPage params={ params }/>
      );

      complaintPage.setState({'loading': false, 'found': true, 'data': data});
      complaintPage.should.renderWithProps(AccompliceOfficerSection, {'officerAllegations': [otherOfficerAllegation]});
      complaintPage.should.renderWithProps(AgainstSection, {
        'officerAllegations': [officerAllegation3,
          officerAllegation2, officerAllegation1]
      });
    });

    it('should show ToggleComplaintPage if toggle is enable', function () {
      complaintPage = ReactTestUtils.renderIntoDocument(
        <ComplaintPage params={ params }/>
      );

      complaintPage.setState({'loading': false, 'found': true, 'toggle': true, 'data': data});
      ReactTestUtils.scryRenderedDOMComponentsWithClass(complaintPage, 'toggle-page content').should.have.length(1);
      ReactTestUtils.scryRenderedComponentsWithType(complaintPage, SearchablePage).should.have.length(0);
    });

    it('should hide ToggleComplaintPage if toggle is disable', function () {
      complaintPage = ReactTestUtils.renderIntoDocument(
        <ComplaintPage params={ params }/>
      );

      complaintPage.setState({'loading': false, 'found': true, 'toggle': false, 'data': data});
      ReactTestUtils.scryRenderedDOMComponentsWithClass(complaintPage, 'toggle-page content').should.have.length(0);
      ReactTestUtils.scryRenderedComponentsWithType(complaintPage, SearchablePage).should.have.length(1);
    });
  });

  ComplaintPage.should.behaveLike('a loadable page');
});
