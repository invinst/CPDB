var History = require('history');

var history = History.useBasename(History.createHistory)({
  basename: '/mobile'
});

module.exports = history;