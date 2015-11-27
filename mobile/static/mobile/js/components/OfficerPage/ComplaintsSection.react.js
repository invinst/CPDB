var React = require('react');

var Collapse = require('components/Shared/Collapse.react');
var ComplaintCard = require('components/Shared/ComplaintCard.react');

var ComplaintsSection = React.createClass({
  render: function () {
    return (
      <div className='complaint-section'>
        <Collapse maxHeight={1000}>
          <div className='section-header'>
            <span className='section-title'>Complaints</span>
            <span className='pull-right collapse-action'>Collapse</span>
          </div>
          <div className='collapse-content animation-long'>
            <ul>
              <li className="complaint-result-item">
                <ComplaintCard />
              </li>
              <li className="complaint-result-item">
                <ComplaintCard />
              </li>
              <li className="complaint-result-item">
                <ComplaintCard />
              </li>
            </ul>
          </div>
        </Collapse>
      </div>
  )}
});

module.exports = ComplaintsSection;
