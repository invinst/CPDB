var gulp = require('gulp');
var env = require('gulp-env');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var rename = require('gulp-rename');


module.exports = function (production) {
  return function () {
    var envs = env.set({
      'NODE_PATH': 'allegation/static/allegation/js',
      'NODE_ENV': production ? 'production' : 'development'
    });
    var b = browserify({
      entries: './allegation/static/allegation/js/app.js'
    });

    return b.bundle()
      .pipe(source('app.js'))
      .pipe(gulpif(production, buffer()))
      .pipe(gulpif(production, uglify()))
      .on('error', gutil.log)
      .pipe(rename('bundle.js'))
      .pipe(envs.reset)
      .pipe(gulp.dest('./static/allegation/js/'));
  };
};
