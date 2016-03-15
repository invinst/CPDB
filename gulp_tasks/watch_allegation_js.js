var watchJS = require('./utils/watch_js');


module.exports = watchJS({
  entries: ['./allegation/static/allegation/js/app.js'],
  dest: './local_static/allegation/js/',
  fileName: 'bundle.js',
  nodePath: 'allegation/static/allegation/js'
});
