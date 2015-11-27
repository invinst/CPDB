var React = require('react');

var SimpleTimeline = require('components/Shared/SimpleTimeline.react');


var InvestigationTimeline =  React.createClass({
  render: function(){
    return  (
      <div className='investigation-timeline'>
         <div className='section-header'>
           <span className='section-title'>Investigation timeline</span>
        </div>
        <SimpleTimeline />
      </div>
    )
  }
});

module.exports = InvestigationTimeline;
