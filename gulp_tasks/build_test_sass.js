var buildSass = require('./utils/build_sass');


module.exports = buildSass({
  src: './common/static/sass/test.sass',
  dest: './static/css',
  fileName: 'test.css'
});
