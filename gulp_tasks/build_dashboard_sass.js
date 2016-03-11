var buildSass = require('./utils/build_sass');


module.exports = buildSass({
  src: './dashboard/static/dashboard/sass/style.sass',
  dest: './static/css',
  fileName: 'dashboard_style.css'
});
