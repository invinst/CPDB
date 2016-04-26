var n = 0;

var Factory = {
  createTagValue: function () {
    n++;
    return {
      value: 'value_' + n,
      category: 'category_' + n,
      displayValue: 'displayValue_' + n,
      displayCategory: 'displayCategory_' + n
    };
  }
};

module.exports = Factory;
