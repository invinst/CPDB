var gulp = require('gulp');
var env = require('gulp-env');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var _ = require('lodash');
var gutil = require('gulp-util');
var browserify = require('browserify');


function watchJS(opts) {
  return function () {
    var browserifyOpts = _.assign({}, watchify.args, {
      entries: opts.entries,
      debug: true
    });
    var bundler;

    function bundleJS(b) {
      return b.bundle()
        .pipe(source(opts.fileName))
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(gulp.dest(opts.dest));
    }

    env.set({
      'NODE_PATH': opts.nodePath,
      'NODE_ENV': 'development'
    });

    bundler = watchify(browserify(browserifyOpts));

    bundleJS(bundler);
    bundler.on('update', function () {
      bundleJS(bundler);
    });
    bundler.on('log', gutil.log);

    return bundler;
  };
}

module.exports = watchJS;
