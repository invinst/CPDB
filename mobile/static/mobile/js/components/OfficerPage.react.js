var React = require('react');
var objectAssign = require('object-assign');

var OfficerDetail = require('components/OfficerPage/OfficerDetail.react');
var OfficerPageStore = require('stores/OfficerPage/OfficerPageStore');
var Base = require('components/Base.react');
var SearchBar = require('components/Shared/SearchBar.react');
var OfficerHeader = require('components/OfficerPage/OfficerHeader.react');
var OfficerTabBar = require('components/OfficerPage/OfficerTabBar.react');
var OfficerSummaryContent = require('components/OfficerPage/OfficerSummaryContent.react');
var Wrapper = require('components/Shared/Wrapper.react');
var OfficerComplaintContent = require('components/OfficerPage/OfficerComplaintContent.react');
var RelatedOfficers = require('components/OfficerPage/RelatedOfficers.react');


var OfficerPage = React.createClass(objectAssign(Base(OfficerPageStore), {
  getInitialState: function () {
    return {
      'currentTab': 'complaints'
    }
  },
  render: function () {
    var currentTab = this.state.currentTab;
    return (
      <div className='officer-page content'>
        <SearchBar />
        <OfficerHeader />
        <OfficerTabBar currerntTab={currentTab}/>
        <Wrapper visible={currentTab=='summary'}>
          <OfficerSummaryContent  />
        </Wrapper>
        <Wrapper visible={currentTab=='complaints'}>
          <OfficerComplaintContent  />
        </Wrapper>
        <Wrapper visible={currentTab=='related_officers'}>
          <RelatedOfficers />
        </Wrapper>
      </div>
    )
  }
}));

module.exports = OfficerPage;
