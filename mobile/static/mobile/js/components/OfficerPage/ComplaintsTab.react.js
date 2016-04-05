var React = require('react');

var u = require('utils/HelperUtil');

var OfficerAllegationItem = require('components/Shared/OfficerAllegationItem.react');



var ComplaintsTab = React.createClass({
  propTypes: {
    officer: React.PropTypes.object,
    complaints: React.PropTypes.array
  },

  renderComplaintItem: function (complaint) {
    var officerAllegations = u.fetch(complaint, 'officer_allegation_set', []);
    var officer = this.props.officer;
    var officerAllegation = officerAllegations.find(function (officerAllegation) {
      return officer['id'] == u.fetch(officerAllegation, 'officer.id');
    });

    return (
      <div key={ complaint['crid'] }>
        <OfficerAllegationItem officerAllegation={ officerAllegation } officerAllegations={ officerAllegations }
          allegation={ complaint }/>
      </div>
    );
  },

  render: function () {
    var complaints = this.props.complaints;

    return (
      <div className='complaints-tab'>
        { complaints.map(this.renderComplaintItem) }
      </div>
    );
  }
});

module.exports = ComplaintsTab;
