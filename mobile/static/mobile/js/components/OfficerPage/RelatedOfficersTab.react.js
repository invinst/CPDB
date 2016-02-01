var React = require('react');

var RelatedOfficerItem = require('components/OfficerPage/RelatedOfficersTab/RelatedOfficerItem.react');
var NoRelatedOfficer = require('components/OfficerPage/RelatedOfficersTab/NoRelatedOfficer.react');


//FIXME : Should refactor this component since we removed witness officers from the related officers
var RelatedOfficersTab = React.createClass({
  renderRelatedOfficers: function (type) {
    return function (officer) {
      return (
        <RelatedOfficerItem type={type} officer={officer} key={officer.id}/>
      );
    };
  },

  render: function () {
    var coAccused = this.props.coAccused;

    if (!coAccused) {
      return (<div></div>);
    }

    if (coAccused.length == 0) {
      return (
        <div>
          <NoRelatedOfficer />
        </div>
      );
    }

    return (
      <div className='related-officers-tab'>
        <div className='co-accused-list'>
          {coAccused.map(this.renderRelatedOfficers('Co-accused'))}
        </div>
      </div>
    );
  }
});

module.exports = RelatedOfficersTab;
