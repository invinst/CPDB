var gulp = require('gulp');
var env = require('gulp-env');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var _ = require('lodash');
var gutil = require('gulp-util');
var browserify = require('browserify');


var opts = _.assign({}, watchify.args, {
  entries: ['./allegation/static/allegation/js/app.js'],
  debug: true
});
var b;

function bundle() {
  return b.bundle()
    .pipe(source('app.js'))
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(gulp.dest('./static/allegation/js/'));
}

env.set({
  'NODE_PATH': 'allegation/static/allegation/js',
  'NODE_ENV': 'development'
});
b = watchify(browserify(opts));
b.on('update', bundle);
b.on('log', gutil.log);

module.exports = bundle;
