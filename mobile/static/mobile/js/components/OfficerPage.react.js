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
var SimpleTab = require('components/Shared/SimpleTab.react');
var RelatedOfficers = require('components/OfficerPage/RelatedOfficers.react');


var OfficerPage = React.createClass(objectAssign(Base(OfficerPageStore), {
  render: function () {
    return (
      <div className='officer-page content'>
        <SearchBar />
        <OfficerHeader />
        <SimpleTab className='officer-page-tabs'>
          <div className='officer-page-tab-navs'>
            <span>Summary</span>
            <span>Complaints</span>
            <span>Relative Officers</span>
          </div>
          <div className='officer-page-tab-contents'>
            <div>
              <OfficerSummaryContent  />
            </div>
            <div>
              <OfficerComplaintContent  />
            </div>
            <div>
              <RelatedOfficers />
            </div>
          </div>
          </SimpleTab>
      </div>
    )
  }
}));

module.exports = OfficerPage;
