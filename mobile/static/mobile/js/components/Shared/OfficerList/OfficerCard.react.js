var React = require('react');


var OfficerCard = React.createClass({
  render: function () {
    var fullName = this.props.fullName;
    var description = this.props.description;

    return (
      <div className='officer-card-wrapper'>
        <a>
          <div className='officer-card'>
            <div className='bold'>{fullName}</div>
            <span>{description}</span>
          </div>
        </a>
      </div>
    )
  }
});

module.exports = OfficerCard;
