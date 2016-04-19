var sinon;
var f, HashUtil, GaUtil, MapFacade;
var AccompliceOfficerSection, AgainstSection, AllegationResourceUtil, ComplainingWitness, ComplaintPage,
  ComplaintPageStore, InvestigatorSection, Location, OfficerAllegationDetail, SearchablePage, DocumentSection;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

require('should');
sinon = require('sinon');

f = require('utils/tests/f');
GaUtil = require('utils/GaUtil');
HashUtil = require('utils/HashUtil');
MapFacade = require('utils/MapFacade');
require('utils/tests/should/SharedExample');
require('tests/examples/components/LoadablePage');
require('utils/tests/should/React');


AccompliceOfficerSection = require('components/ComplaintPage/AccompliceOfficerSection.react');
AgainstSection = require('components/ComplaintPage/AgainstSection.react');
AllegationResourceUtil = require('utils/AllegationResourceUtil');
ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');
ComplaintPage = require('components/ComplaintPage.react');
ComplaintPageStore = require('stores/ComplaintPage/ComplaintPageStore');
DocumentSection = require('components/ComplaintPage/DocumentSection.react');
InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
Location = require('components/ComplaintPage/Location.react');
OfficerAllegationDetail = require('components/ComplaintPage/OfficerAllegationDetail.react');
SearchablePage = require('components/Shared/SearchablePage.react');


function stubForComplaintPage() {
  sinon.stub(GaUtil, 'track');
  sinon.stub(AllegationResourceUtil, 'get');
  sinon.stub(MapFacade, 'initialize');
  sinon.stub(MapFacade, 'addAccidentPlaceMarker');
  sinon.stub(MapFacade, 'addNoAddressPopup');
}

function restoreForComplaintPage() {
  if (MapFacade.initialize.restore) {
    MapFacade.initialize.restore();
  }

  if (MapFacade.addAccidentPlaceMarker.restore) {
    MapFacade.addAccidentPlaceMarker.restore();
  }

  if (MapFacade.addNoAddressPopup.restore) {
    MapFacade.addNoAddressPopup.restore();
  }

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
    var data, officerAllegation, params, category, allegation;

    beforeEach(function () {
      var categoryId = 123;
      category = f.create('Category', {'id': categoryId});

      officerAllegation = f.create('OfficerAllegation', {'cat': category});
      allegation = f.create('Allegation', {'officer_allegation_set': [officerAllegation]});
      data = f.create('ComplaintPageData', {'allegation': allegation});
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
        Location, AccompliceOfficerSection, InvestigatorSection, DocumentSection]);
    });

    it('should render component with correct data for `AgainstSection` and `AccompliceOfficerSection`', function () {
      var otherCategory = f.create('Category', {'id': 456});
      var otherOfficerAllegation = f.create('OfficerAllegation', {'cat': otherCategory});
      allegation = f.create('Allegation', {'officer_allegation_set': [officerAllegation, otherOfficerAllegation]});
      data = f.create('ComplaintPageData', {'allegation': allegation});

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
      allegation = f.create('Allegation', {'officer_allegation_set': [officerAllegation, officerAllegation3,
        officerAllegation1, officerAllegation2]});

      data = f.create('ComplaintPageData', {
        'allegation': allegation
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
      allegation = f.create('Allegation', {'officer_allegation_set': [otherOfficerAllegation, officerAllegation3,
          officerAllegation1, officerAllegation2]});
      data = f.create('ComplaintPageData', {
        'allegation': allegation
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
