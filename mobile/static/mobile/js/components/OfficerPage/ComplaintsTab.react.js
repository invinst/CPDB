var React = require('react');

var OfficerComplaintItem = require('components/OfficerPage/ComplaintTab/OfficerComplaintItem.react');


var ComplaintsTab = React.createClass({
  propTypes: {
    officer: React.PropTypes.object,
    complaints: React.PropTypes.array
  },

  renderComplaintItem: function (complaint) {
    return (
      <div key={ complaint['data']['crid'] }>
        <OfficerComplaintItem officer={ this.props.officer } complaint={ complaint }/>
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
