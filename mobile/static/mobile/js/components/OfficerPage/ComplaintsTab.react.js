var React = require('react');

var OfficerComplaintItem = require('components/OfficerPage/ComplaintTab/OfficerComplaintItem.react');


var OfficerComplaintContent = React.createClass({

  renderComplaintItem: function(complaint){
    return (
      <div>
        <OfficerComplaintItem officer={this.props.officer} complaint={complaint}/>
      </div>
    );
  },

  renderComplaintList: function(complaints) {
    return complaints.map(this.renderComplaintItem);
  },

  render: function () {
    var complaints = this.props.complaints;
    return (
      <div className='complaints-tab'>
        {this.renderComplaintList(complaints)}
      </div>
    );
  }
});

module.exports = OfficerComplaintContent;
