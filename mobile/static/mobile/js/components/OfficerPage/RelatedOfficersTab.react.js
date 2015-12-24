var React = require('react');

var RelatedOfficerItem = require('components/OfficerPage/RelatedOfficersTab/RelatedOfficerItem.react');
var NoRelatedOfficer = require('components/OfficerPage/RelatedOfficersTab/NoRelatedOfficer.react');


var RelatedOfficersTab = React.createClass({
  renderRelatedOfficers: function (type) {
    return function (officer) {
      return (
        <RelatedOfficerItem type={type} officer={officer} />
      );
    };
  },

  render: function () {
    var coAccused = this.props.coAccused;
    var witness = this.props.witness;

    var countOfRelatedOfficer = coAccused.length + witness.length;

    if (countOfRelatedOfficer == 0){
      return (
        <div>
          <NoRelatedOfficer />
        </div>
      )
    }

    return (
      <div className='related-officers-tab'>
        {coAccused.map(this.renderRelatedOfficers('Co-accused'))}
        {witness.map(this.renderRelatedOfficers('Witness'))}
      </div>
    );
  }
});

module.exports = RelatedOfficersTab;
