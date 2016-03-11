var watchJS = require('./utils/watch_js');


module.exports = watchJS({
  entries: ['./allegation/static/allegation/js/app.js'],
  dest: './static/allegation/js/',
  nodePath: 'allegation/static/allegation/js'
});
