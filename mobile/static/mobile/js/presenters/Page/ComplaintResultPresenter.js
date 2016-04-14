var u = require('utils/HelperUtil');
var CollectionUtil = require('utils/CollectionUtil');

var ComplaintResultPresenter = function (meta) {
  var groupByCategory = function () {
    var officerAllegationList = u.fetch(meta, 'officer_allegations', []);
    return CollectionUtil.groupBy(officerAllegationList, function (officerAllegation) {
      return u.fetch(officerAllegation, 'cat.id', 0);
    });
  };

  return {
    'groupByCategory': groupByCategory()
  };
};

module.exports = ComplaintResultPresenter;
