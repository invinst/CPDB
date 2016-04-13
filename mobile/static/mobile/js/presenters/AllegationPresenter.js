var u = require('utils/HelperUtil');

var DateUtil = require('utils/DateUtil');
var AppConstants = require('constants/AppConstants');


var AllegationPresenter = function (complaint) {
  var incidentDate = function () {
    return DateUtil.sanitizeDate(u.fetch(complaint, 'incident_date', ''));
  };

  var incidentDateDisplay = function () {
    var date = incidentDate();
    return date ? date.format(AppConstants.SIMPLE_DATE_FORMAT) : 'Unknown date';
  };

  var add1 = function () {
    return u.fetch(complaint, 'add1', '');
  };

  var add2 = function () {
    return u.fetch(complaint, 'add2', '');
  };

  var crid = function () {
    return u.fetch(complaint, 'crid', 'Unknown');
  };

  var address = function () {
    return [add1(), add2()].join(' ').trim(); // a bit magic here :>)
  };

  var locationType = function () {
    return u.fetch(complaint, 'location', '');
  };

  var url = function () {
    return u.format('/complaint/{crid}', {'crid': crid()});
  };

  var hasLocation = function () {
    return u.hasAnyProperties(complaint, ['beat', 'location', 'add1', 'add2', 'city', 'point']);
  };

  var hasFullAddress = function () {
    return !!(add1() && add2());
  };

  var documentId = function () {
    return u.fetch(complaint, 'document_id', 0);
  };

  return {
    crid: crid(),
    incidentDate: incidentDate(),
    incidentDateDisplay: incidentDateDisplay(),
    address: address(),
    city: u.fetch(complaint, 'city', ''),
    locationType: locationType(),
    beat: u.fetch(complaint, 'beat.name', ''),
    documentId: documentId(),
    documentNormalizedTitle: u.fetch(complaint, 'document_normalized_title', ''),
    hasLocation: hasLocation(),
    hasFullAddress: hasFullAddress(),
    url: url()
  };
};

module.exports = AllegationPresenter;
