var DateUtils = {
  addMonthToDate: function (date, amountOfMonth) {
    date.setMonth(date.getMonth() + amountOfMonth);
  },

  convertDateToDays: function (date) {
    return date.getFullYear() * 365 + date.getMonth() * 30 + date.getDay();
  },

  areCloseDate: function (date1, date2) {
    return Math.abs(convertDateToDays(date1) - convertDateToDays(date2)) < 30 * 3;
  },

  formatDateToString: function (date) {
    var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNamesShort[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }
}

module.exports = DateUtils;
