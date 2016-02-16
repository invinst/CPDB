var _ = require('lodash');
var moment = require('moment');

var GenderPresenter = require('presenters/GenderPresenter');


var ComplaintPresenter = function (complaint) {
  var allegation = complaint.allegation || {};
  var complainingWitness = !_.isEmpty(complaint.complaining_witness) ? complaint.complaining_witness[0] : {};

  var complaintSubCategory = function () {
    return !_.isEmpty(complaint.category) ? complaint.category.allegation_name : '';
  };

  var crid = function () {
    return allegation.crid || '';
  };

  var incidentDate = function () {
    var result = moment(allegation.incident_date);
    return (allegation.incident_date && result.year() > 1970) ? result.format('YYYY-MM-DD') : '';
  };

  var getComplainingWitness = function () {
    var age = complainingWitness.age ? 'Age ' + complainingWitness.age : '';
    var genderReadable = GenderPresenter(complainingWitness.gender);
    var race = complainingWitness.race || '';

    return _([race, genderReadable, age]).compact().join(', ');
  };

  return {
    complaintSubCategory: complaintSubCategory(),
    crid: crid(),
    incidentDate: incidentDate(),
    complainingWitness: getComplainingWitness()
  };
};

module.exports = ComplaintPresenter;
