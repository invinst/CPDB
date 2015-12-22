var React = require('react');

var RelatedOfficerItem = require('components/OfficerPage/RelatedOfficerItem.react');


var RelatedOfficers = React.createClass({
  render: function () {
    return (
      <div className='related-officers'>
        <RelatedOfficerItem />
        <RelatedOfficerItem />
        <RelatedOfficerItem />
        <RelatedOfficerItem />
      </div>
    );
  }
});

module.exports = RelatedOfficers;
