var HelperUtil = require('utils/HelperUtil');
var OfficerPresenter = require('presenters/OfficerPresenter');
var OfficerAllegationPresenter = require('presenters/OfficerAllegationPresenter');


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
    var meta = HelperUtil.fetch(suggestion, 'meta', '');

    var RESOURCE_PRESENTER_MAP = {
      'officer': OfficerPresenter,
      'officer_allegation': OfficerAllegationPresenter
    };

    return RESOURCE_PRESENTER_MAP[resource()](meta);
  };

  var uniqueKey = function () {
    return HelperUtil.format('{resource}-{resourceKey}', {'resource': resource(), 'resourceKey': resourceKey() });
  };

  return {
    text: text(),
    url: url(),
    resource: resource(),
    resourceKey: resourceKey(),
    meta: getMetaPresenter(),
    uniqueKey: uniqueKey()
  };
};

module.exports = SuggestionPresenter;
