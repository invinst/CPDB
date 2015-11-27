var React = require('react');
var Collapse = require('components/Shared/Collapse.react');

var RelatedOfficerCard = React.createClass({
  render: function () {
    var fullName = this.props.fullName;
    var genderInformation = this.props.genderInformation;
    var description = this.props.description;

    return (
      <div className='related-officer-card'>
        <div className='basic-information'>
          <div className='officer-name'>
            {fullName}
          </div>
          <div className='gender-information'>
            {genderInformation}
          </div>
        </div>
        <div className='description'>{description}</div>
      </div>
  )}
});

module.exports = RelatedOfficerCard;
