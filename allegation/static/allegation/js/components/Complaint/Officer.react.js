var React = require('react');
var OfficerMixin = require("../OfficerMixin.react");


var Officer = React.createClass({
  mixins: [OfficerMixin],
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {

  },
  render: function () {
    var officer = this.props.officer;
    if (!officer) {
      return <div></div>
    }
    var officerComplaintAvgStatus = this.getAvgClass();

    var className = 'officer ' + officerComplaintAvgStatus;
    var selection_state = '';
    if (this.props.active) {
      className += " selected";
      selection_state = 'selected';
    }
    var officerLink = officer.absolute_url;
    return <div className={className} data-state={selection_state}>
      <a className='officer-link' href={officerLink}>
        <div className='officer_name'>
          <strong>
            {this.props.officer.officer_first.toLowerCase()} {officer.officer_last.toLowerCase()}
          </strong>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='thirty-five  unit'>Unit {officer.unit}</div>
            <div className='sixty disciplines'>
              <div>{officer.allegations_count} {pluralize('complaint', officer.allegations_count)}</div>
              <div>{officer.discipline_count} {pluralize('discipline', officer.discipline_count)}</div>
            </div>
          </div>
        </div>
      </a>
    </div>

  }
});

module.exports = Officer;
