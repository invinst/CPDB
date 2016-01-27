var HelperUtil = require('utils/HelperUtil');
var OfficerPresenter = require('presenters/OfficerPresenter');
var ComplaintPresenter = require('presenters/ComplaintPresenter');


var SuggestionPresenter = function (suggestion) {

  var text = function () {
    return HelperUtil.fetch(suggestion, 'text', '');
  };

  var url = function () {
    return HelperUtil.fetch(suggestion, 'url', '');
  };

  var resource = function () {
    return HelperUtil.fetch(suggestion, 'resource', '');
  };

  var resourceKey = function () {
    return HelperUtil.fetch(suggestion, 'resource_key', '');
  };

  var getMetaPresenter = function () {
    var meta  = HelperUtil.fetch(suggestion, 'meta', '');

    var RESOURCE_PRESENTER_MAP = {
      'officer': OfficerPresenter,
      'allegation': ComplaintPresenter
    };

    return RESOURCE_PRESENTER_MAP[resource()](meta);
  };

  return {
    text: text(),
    url: url(),
    resource: resource(),
    resourceKey: resourceKey(),
    meta: getMetaPresenter()
  };
};

module.exports = SuggestionPresenter;
