var React = require('react');
var OfficerMixin = require("../OfficerMixin.react");


var Officer = React.createClass({
  mixins: [OfficerMixin],
  getInitialState: function () {
    return {investigation: 0};
  },
  componentDidMount: function () {
  },
  render: function () {
    var rows = [];
    var allegation = this.props.complaint.allegation;
    var investigationData = this.props.investigation;
    if (investigationData) {
      for (var i = 0; i < investigationData.length; i++) {
        var investigation = investigationData[i];

        var style = {
          'width': ( (investigation.count - investigation.no_action_taken_count) / investigation.count ) * 100 + "%"
        };
        var progressStyle = {
          width: 100 + "%"
        };
        rows.push(
          <div key={i}>
            <div>
              {investigation.officer.officer_first}&nbsp;
              {investigation.officer.officer_last}&nbsp;
              ({investigation.count} cases)
            </div>
            <div className="progress complaint" style={progressStyle}>
              <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                   aria-valuemax="100" style={style}>
                <span className="sr-only"></span>
              </div>
            </div>
          </div>
        );
      }
    }

    var investigator = "";
    if (rows.length) {
      investigator = (
        <div>
          <div className='results'>
            <div className='investigator-name'>
              {allegation.investigator_name}
            </div>
            {rows}
          </div>
          <div className="legend">
            <div>
              <span className='red line'></span>No Punishment
            </div>
            <div>
              <span className='blue line'></span>Discipline Applied
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='investigation'>
        <div className='row-fluid'>{investigator}</div>
      </div>
    );
  }
});

module.exports = Officer;
