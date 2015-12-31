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

  var suggestionType = function () {
    return HelperUtil.fetch(suggestion, 'suggestion_type', '');
  };

  return {
    text: text(),
    url: url(),
    resource: resource(),
    resourceKey: resourceKey(),
    suggestionType: suggestionType()
  }
};

module.exports = SuggestionPresenter;
