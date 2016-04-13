var pluralize = require('pluralize');
var S = require('string');

var AppConstants = require('constants/AppConstants');

var u = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');
var GenderPresenter = require('presenters/GenderPresenter');


var OfficerPresenter = function (officer) {
  var displayName = function () {
    var officerFirst = u.fetch(officer, 'officer_first', '');
    var officerLast = u.fetch(officer, 'officer_last', '');

    return [officerFirst, officerLast].join(' ');
  };

  var id = function () {
    return u.fetch(officer, 'id', '').toString();
  };

  var race = function () {
    return u.fetch(officer, 'race', 'Race unknown');
  };

  var gender = function () {
    return GenderPresenter(u.fetch(officer, 'gender')).humanReadable;
  };

  var description = function () {
    return u.format('{gender} ({race})', {'gender': gender(), 'race': race()});
  };

  var badge = function () {
    return u.fetch(officer, 'star', 'Unknown');
  };

  var unit = function () {
    var unitCode = u.fetch(officer, 'unit', '');
    return u.fetch(AppConstants.UNITS, unitCode, 'Unknown');
  };

  var rank = function () {
    var rankCode = u.fetch(officer, 'rank', '');
    return u.fetch(AppConstants.RANKS, rankCode, 'Unknown');
  };

  var joinedDate = function () {
    return u.fetch(officer, 'appt_date', 'Unknown');
  };

  var allegationsCount = function () {
    return u.fetch(officer, 'allegations_count', -1);
  };

  var has = function (officer, field) {
    return !!u.fetch(officer, field, false);
  };

  var hasDataIn = function (officer, field, collection) {
    var datum = u.fetch(officer, field, false);
    return (collection.indexOf(datum) > 0);
  };

  var hasData = function (label) {
    var field = AppConstants.OFFICER_SUMMARY_MAP[label];
    var checkers = {
      'race': has(officer, field),
      'unit': hasDataIn(officer, field, Object.keys(AppConstants.UNITS)),
      'rank': has(officer, field),
      'appt_date': has(officer, field),
      'gender': has(officer, field)
    };

    return checkers[field];
  };

  var hasSummarySection = function () {
    var labels = Object.keys(AppConstants.OFFICER_SUMMARY_MAP);
    var summarySectionData = labels.map(function (label) {
      return hasData(label);
    });
    return CollectionUtil.any(summarySectionData);
  };

  var coAccusedWith = function (numberOfCoAccusedOfficers) {
    var theOthers = pluralize('other', numberOfCoAccusedOfficers, true);
    var withSomeOfficers = u.format(' and {theOthers}', {'theOthers': theOthers});
    var withNoOfficer = '';

    var coAccusedInformation = numberOfCoAccusedOfficers ? withSomeOfficers : withNoOfficer;

    return u.format('{officerName} {coAccusedInformation}',
      {
        'officerName': displayName(),
        'coAccusedInformation': coAccusedInformation
      }).trim();
  };

  var url = function () {
    var template = '/officer/{slug}/{pk}';

    return u.format(template, {
      'slug': S(displayName()).slugify().s,
      'pk': id()
    });
  };

  return {
    id: id(),
    badge: badge(),
    displayName: displayName(),
    description: description(),
    gender: gender(),
    race: race(),
    unit: unit(),
    rank: rank(),
    joinedDate: joinedDate(),
    allegationsCount: allegationsCount(),
    hasData: hasData,
    hasSummarySection: hasSummarySection(),
    coAccusedWith: coAccusedWith,
    url: url()
  };
};

module.exports = OfficerPresenter;
