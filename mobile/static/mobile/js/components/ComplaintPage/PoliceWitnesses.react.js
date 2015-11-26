var cx = require('classnames');
var React = require('react');
var InvestigateCard = require('components/Shared/InvestigateCard.react');
var OfficerList = require('components/Shared/OfficerList.react');
var Collapse = require('components/Shared/Collapse.react');

var InvestigatorPanel =  React.createClass({
  render: function(){
    return  (
      <div className='police-witness'>
        <Collapse>
          <div className='section-header'>
            <span className='section-title'>Police Witnesses</span>
            <span className='pull-right collapse-action'>Collapse</span>
          </div>
          <div className='collapse-content animation'>
            <div className='legend'>
              <span> -- No punishment</span>
              <span> -- Descipline applied</span>
            </div>
            <div className="police-witness-list">
              <label>Officer name</label>
              <div>Male, Native American</div>

              <div className='item'>
                <span>Officer 01 name (7 cases)</span>
                <div> Progresss....</div>
              </div>
              <div className='item'>
                <span>Officer 01 name (7 cases)</span>
                <div> Progresss....</div>
              </div>
              <div className='item'>
                <span>Officer 01 name (7 cases)</span>
                <div> Progresss....</div>
              </div>
              <div className='item'>
                <span>Officer 01 name (7 cases)</span><div> Progresss....</div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
});

module.exports = InvestigatorPanel;
