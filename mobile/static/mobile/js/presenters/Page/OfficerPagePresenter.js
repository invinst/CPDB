var moment = require('moment');

var u = require('utils/HelperUtil');


var OfficerPagePresenter = function (officer) {
  var getComplaints = function () {
    var complaints = u.fetch(officer, 'complaints', {});
    return complaints.sort(function (a, b) {
      var dateA = u.fetch(a, 'data.allegation.incident_date', 0);
      var dateB = u.fetch(b, 'data.allegation.incident_date', 0);

      return moment(dateB).valueOf() - moment(dateA).valueOf();
    });
  };

  return {
    'complaints': getComplaints(),
    'officerDetail': u.fetch(officer, 'detail', {}),
    'coAccused': u.fetch(officer, 'co_accused', {}),
    'distribution': u.fetch(officer, 'distribution', {})
  };
};

module.exports = OfficerPagePresenter;
