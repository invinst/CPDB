var cx = require('classnames');
var React = require('react');


var Logo = React.createClass({
  render: function () {
    var classNames = cx('animation', 'pad', {'top-left': this.props.topLeft});

    return (
      <div id='logo' className={classNames}>
        <div className='cpdb-logo'>
          CPDP
        </div>
        <div className='cpdb-description'>
          <div>Allegations of police misconduct are public information.
          </div>
          <br/>
          <div>
            Search here for complaint records released under FOIA by the Chicago Police Department. Type the name of
            a police officer, badge number, or CRID number.
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Logo;
