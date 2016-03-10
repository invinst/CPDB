var gulp = require('gulp');


module.exports = function () {
  return gulp.src('./common/templates/**/*', {base: 'common/templates'})
    .pipe(gulp.dest('templates'));
};
