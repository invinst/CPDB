var OFFICER_COMPLAINT_COUNT_RANGE = [
    [20, 0],
    [9, 20],
    [3, 9],
    [2, 3],
    [0, 2]
];

var OfficerMixin = {
  getAvgClass: function () {
    return 'avg-' + this.getAvgLevel(this.props.officer);
  },

  getAvgLevel: function (officer) {
    var i;

    for (i = 0; i < OFFICER_COMPLAINT_COUNT_RANGE.length; i++) {
      if (officer.allegations_count >= OFFICER_COMPLAINT_COUNT_RANGE[i][0]) {
        return i;
      }
    }
  }
};

module.exports = OfficerMixin;
