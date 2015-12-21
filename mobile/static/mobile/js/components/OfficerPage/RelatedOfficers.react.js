var React = require('react');

var RelatedOfficerItem = require('components/OfficerPage/RelatedOfficer/RelatedOfficerItem.react');
var Navigator = require('components/OfficerPage/Navigator.react');


var RelatedOfficers = React.createClass({
  render: function () {
    return (
      <div className='related-officers'>
        <RelatedOfficerItem />
        <RelatedOfficerItem />
        <RelatedOfficerItem />
        <RelatedOfficerItem />
        <Navigator leftAction='complaints' leftText='Complaints'
                   rightAction='summary' rightText='Summary'
        />
      </div>
    );
  }
});

module.exports = RelatedOfficers;
