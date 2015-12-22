var React = require('react');

var RelatedOfficerItem = require('components/OfficerPage/RelatedOfficersTab/RelatedOfficerItem.react');


var RelatedOfficers = React.createClass({
  render: function () {
    return (
      <div className='related-officers-tab'>
        <RelatedOfficerItem />
        <RelatedOfficerItem />
        <RelatedOfficerItem />
        <RelatedOfficerItem />
      </div>
    );
  }
});

module.exports = RelatedOfficers;
