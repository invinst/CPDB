var watchJS = require('./utils/watch_js');


module.exports = watchJS({
  entries: ['./mobile/static/mobile/js/app.js'],
  dest: './static/mobile/js/',
  nodePath: 'mobile/static/mobile/js'
});
