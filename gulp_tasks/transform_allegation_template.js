var gulp = require('gulp');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var _ = require('lodash');


function replaceStaticTagWithRealPath(match, offset, string) {
  var patterns = [
    [/{% static '(js\/.*)' %}/g, 'common/static/$1'],
    [/{% static '(search\/.*)' %}/g, 'search/static/$1'],
    [/{% static '(allegation\/.*)' %}/g, 'allegation/static/$1'],
    [/{% static '(icomoon\/.*)' %}/g, 'allegation/static/$1'],
    [/{% static '(graph\/.*)' %}/g, 'graph/static/$1'],
    [/{% static '(.*)' %}/g, 'bower_components/$1']
  ];

  _.each(patterns, function (data) {
    var regex = data[0];
    var replaceStr = data[1];
    match = match.replace(regex, replaceStr);
  });

  return match;
}


module.exports = function () {
  return gulp.src(['./allegation/templates/allegation/index.html'])
    .pipe(replace(/<!-- build(?:.|\s)+?<!-- endbuild/g, replaceStaticTagWithRealPath))
    .pipe(useref({
      searchPath: '.'
    }))
    .pipe(gulpif('index.html', source('index.html')
      .pipe(replace(/(<script src=")(js\/combined.js)/g, '$1{% static \'$2\' %}'))
    ))
    .pipe(gulpif('index.html', source('index.html')
      .pipe(replace(/(<link.+? href=")(css\/combined.css)/g, '$1{% static \'$2\' %}'))
    ))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('static'));
};
