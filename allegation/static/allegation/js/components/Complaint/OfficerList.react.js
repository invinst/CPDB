var React = require('react');
var Officer = require('../Officer.react');
var Investigator = require('./Investigator.react');


var OfficerList = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var complaint = this.props.complaint;
    var investigation = this.props.investigation;
    var i;
    var rows = [];
    var investigator;

    var officerCount = complaint.officers.length + (complaint.officer && 1);

    var officerCol = 10;
    var officerPerRow = 5;
    var officerPerCol = 2;
    if (complaint.allegation.investigator) {
      officerPerRow = Math.min(3, officerCount);
      officerCol = officerPerRow * 2;
      investigator = (
        <div className="col-md-4" key="investigator">
          <div className="section-title">
            Investigator
          </div>
          <Investigator complaint={complaint}/>
        </div>
      )
    }

    if (officerCount) {
      if (officerCol != 10) {
        officerPerCol = 12 / officerPerRow;
      }
      var officerClass = " col-md-3 col-xs-6 col-sm-4";
      var className;

      if (complaint.officer) {
        className = investigator ? officerClass : '  col-md-3 col-xs-6 col-sm-4';
        rows.push(
          <div className={className} key="officer">
            <Officer active={true} officer={complaint.officer} noClick={true}/>
          </div>
        );
      }
      for (i = 0; i < complaint.officers.length; i++) {
        className = officerClass;
        rows.push(
          <div className={className} key={i}>
            <Officer active={true} officer={complaint.officers[i]} noClick={true}/>
          </div>
        );
      }

      if (investigator) {
        className = "col-md-" + officerCol + " col-md-offset-1";
        rows = (
          <div>
            <div className={className}>
              <div className="section-title">
                {pluralize('Officer', complaint.officers.length + 1)} Involved
              </div>
              <div className="row">
                {rows}
              </div>
            </div>
            {investigator}
          </div>
        )
      } else {
        rows = (
          <div>
            <div className="section-title col-md-10 col-md-offset-1">
              Officers Involved

            </div>
            <div className="col-md-10 col-md-offset-1">
              <div className="row">{rows}</div>
            </div>
          </div>
        )
      }
    } else if (investigator) {
      rows = (investigator)
    }

    return (
      <div className="row officers">
        {rows}
      </div>
    );
  }
});

module.exports = OfficerList;
