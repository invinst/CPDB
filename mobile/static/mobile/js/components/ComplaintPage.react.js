var React = require('react');
var Logo = require('components/Shared/Logo.react');
var ComplaintDetail = require('components/ComplaintPage/ComplaintDetail.react');
var About = require('components/Shared/About.react');
var OfficerInvolved = require('components/ComplaintPage/OfficerInvolved.react');
var InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
var InvestigationTimeline = require('components/ComplaintPage/InvestigationTimeline.react');
var Location = require('components/ComplaintPage/Location.react');
var PoliceWitnesses = require('components/ComplaintPage/PoliceWitnesses.react');


var ComplaintPage = React.createClass({
  render: function () {
    return (
      <div className='complaint-page'>
        <Logo topLeft={true}/>
        <div className='content'>
          <div className='pad'>
            <div className='complaint-category'>
              Arrest/Look-up Procedures
            </div>
            <div className='complaint-sub-category'>
              03C Search Of Premise/Vehicle Without Warrant
            </div>
            <ComplaintDetail/>
            <OfficerInvolved />
            <InvestigatorSection />
            <InvestigationTimeline />
            <Location />
            <PoliceWitnesses />
            <div className='actions center'>
              <button className='btn btn-block'>Request</button>
              <button className='btn btn-block'>Close</button>
            </div>
          </div>
          <div className='box'>
            <About />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ComplaintPage;
