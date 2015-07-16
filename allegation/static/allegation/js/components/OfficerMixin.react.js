

var OFFICER_COMPLAINT_COUNT_RANGE = [
    [20, 0],
    [9, 20],
    [3, 9],
    [2, 3],
    [0, 2]
];

var OfficerMixin = {
  getAvgClass: function() {
    for (var i = 0; i < OFFICER_COMPLAINT_COUNT_RANGE.length; i++) {
      if (this.props.officer.allegations_count >= OFFICER_COMPLAINT_COUNT_RANGE[i][0]) {
        return 'avg-' + i;
      }
    }
  }
};

module.exports = OfficerMixin;
