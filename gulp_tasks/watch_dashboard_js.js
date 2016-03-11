var watchJS = require('./utils/watch_js');


module.exports = watchJS({
  entries: ['./dashboard/static/dashboard/js/app.js'],
  dest: './static/dashboard/js/',
  nodePath: 'dashboard/static/dashboard/js'
});
