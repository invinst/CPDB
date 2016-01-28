var StringUtil = {
  removeMultipleSpace: function (str) {
    return str.replace(/\s{2,}/g, ' ');
  },

  removeNonAlphaNumeric: function (str) {
    return str.replace(/[^\w\s]/gi, '');
  },

  slugify: function (title) {
    var asciiTitle = this.removeNonAlphaNumeric(title);
    var singleSpaceTitle = this.removeMultipleSpace(asciiTitle).trim();
    var lowerCaseTitle  = singleSpaceTitle.toLowerCase();

    return lowerCaseTitle.replace(/\s/g, '-').trim();
  }
};

module.exports = StringUtil;
