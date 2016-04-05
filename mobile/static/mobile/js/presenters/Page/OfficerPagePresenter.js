var moment = require('moment');

var u = require('utils/HelperUtil');


var OfficerPagePresenter = function (pageData) {
  var getComplaints = function () {
    var complaints = u.fetch(pageData, 'complaints', {});
    return complaints.sort(function (a, b) {
      var dateA = u.fetch(a, 'incident_date', 0);
      var dateB = u.fetch(b, 'incident_date', 0);

      return moment(dateB).valueOf() - moment(dateA).valueOf();
    });
  };

  return {
    'complaints': getComplaints(),
    'officerDetail': u.fetch(pageData, 'detail', {}),
    'coAccused': u.fetch(pageData, 'co_accused', {}),
    'distribution': u.fetch(pageData, 'distribution', {})
  };
};

module.exports = OfficerPagePresenter;
