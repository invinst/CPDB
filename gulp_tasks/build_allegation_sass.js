var buildSass = require('./utils/build_sass');


module.exports = buildSass({
  src: './common/static/sass/style.sass',
  dest: './static/css',
  fileName: 'style.css'
});
