var React = require('react');

var About = require('components/Shared/About.react');
var ComplaintsSection = require('components/OfficerPage/ComplaintsSection.react');
var Logo = require('components/Shared/Logo.react');
var StatisticSection = require('components/OfficerPage/StatisticSection.react');
var RelatedOfficersSection = require('components/OfficerPage/RelatedOfficersSection.react');
var OfficerDetail = require('components/OfficerPage/OfficerDetail.react');


var OfficerPage = React.createClass({
  render: function () {
    return (
      <div className='complaint-page'>
        <Logo topLeft={true}/>
        <div className='content'>
          <div className='pad'>
            <OfficerDetail />
            <StatisticSection />
            <RelatedOfficersSection />
            <ComplaintsSection />
          </div>
          <div className='box'>
            <About />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OfficerPage;
