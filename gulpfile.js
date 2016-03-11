var gulp = require('gulp');

var buildAllegationJSTask = require('./gulp_tasks/build_allegation_js');
var buildAllegationCSSTask = require('./gulp_tasks/build_allegation_sass');

var buildDashboardJSTask = require('./gulp_tasks/build_dashboard_js');
var buildDashboardCSSTask = require('./gulp_tasks/build_dashboard_sass');

var buildMobileJSTask = require('./gulp_tasks/build_mobile_js');
var buildMobileCSSTask = require('./gulp_tasks/build_mobile_sass');

var buildSunburstJSTask = require('./gulp_tasks/build_sunburst_js');


gulp.task('build_test_sass', require('./gulp_tasks/build_test_sass'));


/////////////////////////////////////////////////////////////////
///                  ALLEGATION APP TASKS                     ///
/////////////////////////////////////////////////////////////////
gulp.task('collectstatic', require('./gulp_tasks/collectstatic'));

gulp.task('build_allegation_js_minified', ['collectstatic'], buildAllegationJSTask(true));
gulp.task('build_allegation_js', buildAllegationJSTask(false));

gulp.task('build_allegation_sass', ['collectstatic'], buildAllegationCSSTask);
gulp.task('compile_allegation_sass', buildAllegationCSSTask);

gulp.task('transform_allegation_template', ['collectstatic'], require('./gulp_tasks/transform_allegation_template'));

gulp.task('collect_common_template', ['collectstatic'], require('./gulp_tasks/collect_common_template'));

gulp.task('collect_bower_fonts', ['collectstatic'], require('./gulp_tasks/collect_bower_fonts'));

gulp.task('watch_allegation_js', require('./gulp_tasks/watch_allegation_js'));

gulp.task('watch_allegation_sass', ['compile_allegation_sass'], function () {
  gulp.watch('./common/static/sass/**/*', ['compile_allegation_sass']);
});

gulp.task('build_allegation', [
  'build_allegation_sass', 'build_allegation_js_minified',
  'transform_allegation_template', 'collect_common_template',
  'collect_bower_fonts'
]);

gulp.task('watch_allegation', ['watch_allegation_js', 'watch_allegation_sass']);


/////////////////////////////////////////////////////////////////
///                   DASHBOARD APP TASKS                     ///
/////////////////////////////////////////////////////////////////
gulp.task('transform_dashboard_template', ['build_dashboard_sass'],
 require('./gulp_tasks/transform_dashboard_template'));

gulp.task('build_dashboard_sass', ['collectstatic'], buildDashboardCSSTask);
gulp.task('compile_dashboard_sass', buildDashboardCSSTask);

gulp.task('build_dashboard_js', buildDashboardJSTask(false));
gulp.task('build_dashboard_js_minified', ['collectstatic'], buildDashboardJSTask(true));

gulp.task('watch_dashboard_js', require('./gulp_tasks/watch_dashboard_js'));
gulp.task('watch_dashboard_sass', ['compile_dashboard_sass'], function () {
  gulp.watch('./dashboard/static/dashboard/sass/**/*', ['compile_dashboard_sass']);
});

gulp.task('watch_dashboard', ['watch_dashboard_js', 'watch_dashboard_sass']);
gulp.task('build_dashboard', ['collect_bower_fonts', 'transform_dashboard_template', 'build_dashboard_js_minified']);



/////////////////////////////////////////////////////////////////
///                    MOBILE APP TASKS                       ///
/////////////////////////////////////////////////////////////////
gulp.task('transform_mobile_template', ['build_mobile_sass'], require('./gulp_tasks/transform_mobile_template'));

gulp.task('build_mobile_sass', ['collectstatic'], buildMobileCSSTask);
gulp.task('compile_mobile_sass', buildMobileCSSTask);

gulp.task('build_mobile_js', buildMobileJSTask(false));
gulp.task('build_mobile_js_minified', ['collectstatic'], buildMobileJSTask(true));

gulp.task('watch_mobile_js', require('./gulp_tasks/watch_mobile_js'));
gulp.task('watch_mobile_sass', ['compile_mobile_sass'], function () {
  gulp.watch('./mobile/static/mobile/sass/**/*', ['compile_mobile_sass']);
});

gulp.task('watch_mobile', ['watch_mobile_js', 'watch_mobile_sass']);
gulp.task('build_mobile', [
  'transform_mobile_template', 'build_mobile_js_minified', 'collect_common_template', 'collect_bower_fonts'
]);


/////////////////////////////////////////////////////////////////
///                   SUNBURST APP TASKS                      ///
/////////////////////////////////////////////////////////////////
gulp.task('transform_sunburst_template', ['build_allegation_sass'],
  require('./gulp_tasks/transform_sunburst_template'));

gulp.task('build_sunburst_js', buildSunburstJSTask(false));
gulp.task('build_sunburst_js_minified', ['collectstatic'], buildSunburstJSTask(true));

gulp.task('build_sunburst', ['transform_sunburst_template', 'build_sunburst_js_minified', 'collect_bower_fonts']);



gulp.task('circleci', [
  'build_test_sass', 'build_allegation_js', 'build_dashboard_js', 'build_mobile_js', 'build_sunburst_js',
  'compile_mobile_sass', 'compile_dashboard_sass', 'compile_allegation_sass'
]);
gulp.task('build', ['build_allegation', 'build_dashboard', 'build_mobile', 'build_sunburst']);
gulp.task('dev', ['watch_allegation', 'watch_dashboard', 'watch_mobile']);
