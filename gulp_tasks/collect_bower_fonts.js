var gulp = require('gulp');


module.exports = function () {
  return gulp.src([
    './bower_components/components-font-awesome/fonts/**/*',
    './bower_components/bootstrap/fonts/**/*',
    './bower_components/bootstrap-material-design/fonts/**/*'
  ]).pipe(gulp.dest('./static/fonts/'));
};
