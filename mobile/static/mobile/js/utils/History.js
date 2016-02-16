var History = require('history');

var history = History.useBasename(History.createHistory)({
  basename: '/'
});

module.exports = history;
