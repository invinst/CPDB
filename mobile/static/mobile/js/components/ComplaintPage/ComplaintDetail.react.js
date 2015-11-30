var React = require('react');
var Separator = require('components/Shared/Separator.react');

var ComplaintDetail = React.createClass({
  render: function () {
    return (
      <div className='complaint-detail'>
        <div className='complaint-category'>
          Arrest/Look-up Procedures
        </div>
        <div className='complaint-sub-category'>
          03C Search Of Premise/Vehicle Without Warrant
        </div>
        <div className='detail'>
          <div className='under-line'>
            <div className='inline'>
              <label>CRID</label><span>104909</span>
            </div>
            <Separator />
            <div className='inline'><label>Incident Date</label><span>2014-10-23</span>
            </div>
          </div>
          <div className='under-line'>
            <label>Finding</label>
            <span>Open investigation</span>
          </div>
          <div className='under-line'>
            <label>Outcome</label>
            <span>No action taken</span>
          </div>
          <div>
            <label>Complaining Witness</label>
            <span>Black, Female, Age 25</span>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ComplaintDetail;
