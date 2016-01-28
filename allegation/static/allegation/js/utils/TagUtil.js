var _ = require('lodash');


var TagUtil = {
  isSameTag: function (current, other) {
    return (current.value[0] == other.value[0] && current.value[1] == other.value[1]);
  },

  isDuplicatedTag: function (tags, tag) {
    for (var i = 0; i < tags.length; i++) {
      if (this.isSameTag(tags[i], tag)) {
        return true;
      }
    }
    return false;
  },

  isATagIn: function(tags) {
    return function(category, value) {
      return _(tags).chain().get(category, []).get('value', []).contains(value).value();
    };
  }
};

module.exports = TagUtil;
