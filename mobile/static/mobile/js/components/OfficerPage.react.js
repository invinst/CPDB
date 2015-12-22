var React = require('react');
var objectAssign = require('object-assign');

var OfficerPageStore = require('stores/OfficerPage/OfficerPageStore');
var Base = require('components/Base.react');
var SearchBar = require('components/Shared/SearchBar.react');
var OfficerHeader = require('components/OfficerPage/OfficerHeader.react');
var SummaryTab = require('components/OfficerPage/SummaryTab.react');
var Wrapper = require('components/Shared/Wrapper.react');
var OfficerComplaintContent = require('components/OfficerPage/OfficerComplaintContent.react');
var SimpleTab = require('components/Shared/SimpleTab.react');
var RelatedOfficers = require('components/OfficerPage/RelatedOfficers.react');


var OfficerPage = React.createClass(objectAssign(Base(OfficerPageStore), {
  render: function () {
    return (
      <div className='officer-page'>
        <div className='content'>
          <SearchBar />
          <OfficerHeader />
          <div className='tabs'>
            <SimpleTab navigation={true}>
              <div>
                <div>Summary</div>
                <div>Complaints</div>
                <div>Relative Officers</div>
              </div>
              <div className='officer-page-content'>
                <div>
                  <SummaryTab />
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
        </div>
      </div>
    )
  }
}));

module.exports = OfficerPage;
