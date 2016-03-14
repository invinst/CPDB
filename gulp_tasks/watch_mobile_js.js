var watchJS = require('./utils/watch_js');


module.exports = watchJS({
  entries: ['./mobile/static/mobile/js/app.js'],
  dest: './local_static/mobile/js/',
  fileName: 'bundle.js',
  nodePath: 'mobile/static/mobile/js'
});
