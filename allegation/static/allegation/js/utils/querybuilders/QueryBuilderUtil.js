var _ = require('lodash');


function mergeArray(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return _.union(objValue, srcValue);
  }
}


var QueryBuilderUtil = {
  mergeQueryParams: function (params) {
    return _.merge.apply(this, params.concat(mergeArray));
  }
};

module.exports = QueryBuilderUtil;
