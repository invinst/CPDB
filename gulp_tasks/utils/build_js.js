var gulp = require('gulp');
var env = require('gulp-env');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');


module.exports = function (options) {
  return function () {
    var envs = env.set({
      'NODE_PATH': options.nodePath,
      'NODE_ENV': options.production ? 'production' : 'development'
    });
    var b = browserify({
      entries: options.entries
    });

    return b.bundle()
      .pipe(source(options.bundleName))
      .pipe(gulpif(options.production, buffer()))
      .pipe(gulpif(options.production, uglify()))
      .on('error', gutil.log)
      .pipe(envs.reset)
      .pipe(gulp.dest(options.dest));
  };
};
