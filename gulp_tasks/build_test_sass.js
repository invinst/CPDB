var buildSass = require('./utils/build_sass');


module.exports = buildSass({
  src: './common/static/sass/test.sass',
  dest: './local_static/css',
  fileName: 'test.css'
});
