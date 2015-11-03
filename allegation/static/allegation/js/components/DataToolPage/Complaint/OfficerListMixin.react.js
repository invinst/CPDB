var React = require('react');

var Officer = require('components/DataToolPage/Officer.react');

var OfficerListMixin = {
  getOfficerCount: function () {
    var complaint = this.props.complaint;
    return complaint.officers.length + (complaint.officer && 1);
  },

  renderOfficerList: function () {
    var complaint = this.props.complaint;
    var officerClass = this.getOfficerClass();

    var officers = complaint.officers.map(function (officer) {
      return (
        <div className={officerClass} key={officer.id}>
          <Officer active={true} officer={officer} noClick={true}/>
        </div>
      );
    });
    
    if (complaint.officer) {
      officers.unshift(
        <div className={officerClass} key={complaint.officer.id}>
          <Officer active={true} officer={complaint.officer} noClick={true}/>
        </div>
      );
    }

    return officers;
  },
};

module.exports = OfficerListMixin