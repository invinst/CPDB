var React = require('react');
var OfficerPresenter = require('presenters/OfficerPresenter');


var OfficerHeader = React.createClass({
  render: function () {
    var officerPresenter = OfficerPresenter(this.props.officer);

    return (
      <div className='officer-header'>
        <div className='pad'>
          <div className='badge-info'>
            <span className='badge-label'>Badge &nbsp;</span>
            <span className='badge-value'>{officerPresenter.badge}</span>
          </div>
          <div className='name'>{officerPresenter.displayName}</div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerHeader;
