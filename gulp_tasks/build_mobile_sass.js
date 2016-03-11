var buildSass = require('./utils/build_sass');


module.exports = buildSass({
  src: './mobile/static/mobile/sass/style.sass',
  dest: './static/css',
  fileName: 'mobile_style.css'
});
