var watchJS = require('./utils/watch_js');


module.exports = watchJS({
  entries: ['./dashboard/static/dashboard/js/app.js'],
  dest: './local_static/dashboard/js/',
  fileName: 'bundle.js',
  nodePath: 'dashboard/static/dashboard/js'
});
