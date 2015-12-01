var React = require('react');
var Separator = require('components/Shared/Separator.react');

var OfficerDetail = React.createClass({
  render: function () {
    return (
      <div className='officer-detail'>
        <div className='officer-title'>
          <span className='officer-id'>123456</span>
          <span className='officer-name'>John Angelopoulos</span>
        </div>
        <div className='information'>
          <div>
            <label>Unit</label>
            <div className='inline office-unit'>
              <span>135 - Chicago Alternatlve Policing Stragety (CAPS) Division</span>
            </div>
          </div>
          <div className='top-bottom-gray-border'>
            <div className='inline'>
              <label>Rank</label>
              <span>Police Officer</span>
            </div>
            <Separator />
            <div className='inline'>
              <label>Joined</label>
              <span>Jan 26, 2005</span>
            </div>
          </div>
          <div>
            <div className='inline'>
              <label>Gender</label>
              <span>Female</span>
            </div>
            <Separator />
            <div className='inline'>
              <label>Race</label>
              <span>Native American</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OfficerDetail;
