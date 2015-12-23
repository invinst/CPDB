var React = require('react');

var RelatedOfficerItem = require('components/OfficerPage/RelatedOfficersTab/RelatedOfficerItem.react');


var RelatedOfficersTab = React.createClass({
  renderRelatedOfficers: function (type) {
    return function (officer) {
      return (
        <RelatedOfficerItem type={type} officer={officer} />
      );
    };
  },

  render: function () {
    return (
      <div className='related-officers-tab'>
        {this.props.coAccused.map(this.renderRelatedOfficers('Co-accused'))}
        {this.props.witness.map(this.renderRelatedOfficers('Witness'))}
      </div>
    );
  }
});

module.exports = RelatedOfficersTab;
