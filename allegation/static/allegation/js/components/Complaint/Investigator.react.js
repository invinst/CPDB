var React = require('react');
var OfficerMixin = require("../OfficerMixin.react");


var Officer = React.createClass({
  mixins: [OfficerMixin],
  render: function () {
    var investigator = this.props.complaint.investigator;
    var more = '';

    var progressStyle = {
      width: '100%'
    };
    var percent = (investigator.discipline_count / investigator.complaint_count) * 100;
    var style = {
      width: percent + '%'
    };

    if (investigator.complaint_count > 1) {
      more = (
        <div>
          ({investigator.complaint_count} {pluralize('case', investigator.complaint_count)})
          <div className="progress complaint" style={progressStyle}>
            <div className="progress-bar discipline" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                 aria-valuemax="100" style={style}>
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='investigation'>
        <div className='row-fluid'>
          <div>
            <div className='results'>
              <div className='investigator-name'>
                {investigator.name}
              </div>
              {more}
            </div>
            <div className="legend">
              <div>
                <span className='red line'></span>Discipline Applied
              </div>
              <div>
                <span className='blue line'></span>No Punishment
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Officer;
