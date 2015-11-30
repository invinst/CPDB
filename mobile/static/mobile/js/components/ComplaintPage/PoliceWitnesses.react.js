var React = require('react');


var Collapse = require('components/Shared/Collapse.react');
var ProgressBar = require('components/Shared/ProgressBar.react');

var PoliceWiteness = React.createClass({
  render: function () {
    return (
      <div className='police-witness'>
        <Collapse>
          <div className='section-header'>
            <span className='section-title'>Police Witnesses</span>
            <span className='pull-right collapse-action'>Collapse</span>
          </div>
          <div className='collapse-content animation'>
            <div className='legend'>
              <span className='legend-block'>
                <span className='legend-bar'></span>
                <span className='legend-title'>No punishment</span>
              </span>
              <span className='legend-block'>
                <span className='legend-bar background-gray'></span>
                <span className='legend-title'>Descipline applied</span>
              </span>
            </div>
            <div className='police-witness-list'>
              <label>Officer name</label>
              <div>Male, Native American</div>

              <div className='item'>
                <span>Officer 01 name (7 cases)</span>
                <ProgressBar value={10} total={25}/>
              </div>
              <div className='item'>
                <span>Officer 01 name (7 cases)</span>
                <ProgressBar value={10} total={70}/>
              </div>
              <div className='item'>
                <span>Officer 01 name (7 cases)</span>
                <ProgressBar value={10} total={40}/>
              </div>
              <div className='item'>
                <span>Officer 01 name (7 cases)</span>
                <ProgressBar value={10} total={30}/>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
});

module.exports = PoliceWiteness;
