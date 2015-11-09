var React = require('react');


var OfficerListMixin = {
  getOfficerCount: function () {
    var complaint = this.props.complaint;
    return complaint.officers.length + (complaint.officer && 1);
  },
};

module.exports = OfficerListMixin