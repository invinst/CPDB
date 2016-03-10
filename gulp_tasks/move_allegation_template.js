var gulp = require('gulp');
var del = require('del');
var vinylPaths = require('vinyl-paths');


module.exports = function () {
  return gulp.src('./static/index.html')
      .pipe(vinylPaths(del))
      .pipe(gulp.dest('templates/allegation'));
};
