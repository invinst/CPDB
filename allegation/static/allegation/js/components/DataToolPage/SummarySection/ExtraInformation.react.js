var React = require('react');


var ExtraInformation = React.createClass({
  render: function () {
    return (
      <div className='extra-information'>
        <div className='row'>
          <div className='width-12-percent'>
            <span className='background-light-blue box'></span>
            <span className='extra-information-text'>Disciplines</span>
          </div>
          <div className='width-12-percent'>
            <span className='background-grey box'></span>
            <span className='extra-information-text'>Complaints</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExtraInformation;
