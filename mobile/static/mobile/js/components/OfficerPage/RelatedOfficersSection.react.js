var React = require('react');
var Collapse = require('components/Shared/Collapse.react');
var RelatedOfficerCard = require('components/OfficerPage/RelatedOfficerCard.react');


var RelatedOfficersSestion = React.createClass({
  render: function () {
    return (
      <div className='statistic-section'>
        <Collapse maxHeight={1000}>
          <div className='section-header'>
            <span className='section-title'>Related Officers</span>
            <span className='pull-right collapse-action'>Collapse</span>
          </div>
          <div className='collapse-content animation-long'>
            <div className='related-officer-list'>
              <RelatedOfficerCard fullName='John Angelopoulos' genderInformation='Female Native American' description='Co-accused in 11 cases'/>
              <RelatedOfficerCard fullName='John Angelopoulos' genderInformation='Female Native American' description='Co-accused in 11 cases'/>
              <RelatedOfficerCard fullName='John Angelopoulos' genderInformation='Female Native American' description='Co-accused in 11 cases'/>
              <RelatedOfficerCard fullName='John Angelopoulos' genderInformation='Female Native American' description='Co-accused in 11 cases'/>
              <RelatedOfficerCard fullName='John Angelopoulos' genderInformation='Female Native American' description='Co-accused in 11 cases'/>
            </div>
          </div>
        </Collapse>
      </div>
  )}
});

module.exports = RelatedOfficersSestion;
