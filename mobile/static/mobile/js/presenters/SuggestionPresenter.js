var HelperUtil = require('utils/HelperUtil');


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

  var getMeta = function () {
    return HelperUtil.fetch(suggestion, 'meta', '');
  };

  var uniqueKey = function () {
    return HelperUtil.format('{resource}-{resourceKey}', {'resource': resource(), 'resourceKey': resourceKey() });
  };

  return {
    text: text(),
    url: url(),
    resource: resource(),
    resourceKey: resourceKey(),
    meta: getMeta(),
    uniqueKey: uniqueKey()
  };
};

module.exports = SuggestionPresenter;
