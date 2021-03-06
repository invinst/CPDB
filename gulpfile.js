var gulp = require('gulp');
var runSequence = require('run-sequence');

var buildAllegationJSTask = require('./gulp_tasks/build_allegation_js');
var buildAllegationCSSTask = require('./gulp_tasks/build_allegation_sass');
var buildTestCSSTask = require('./gulp_tasks/build_test_sass');

var buildDashboardJSTask = require('./gulp_tasks/build_dashboard_js');
var buildDashboardCSSTask = require('./gulp_tasks/build_dashboard_sass');

var buildMobileJSTask = require('./gulp_tasks/build_mobile_js');
var buildMobileCSSTask = require('./gulp_tasks/build_mobile_sass');

var buildSunburstJSTask = require('./gulp_tasks/build_sunburst_js');

var mkdirTask = require('./gulp_tasks/mkdir');


gulp.task('circle_test_sass', buildTestCSSTask(false));
gulp.task('compile_test_sass', buildTestCSSTask(true));

gulp.task('transform_base_template', require('./gulp_tasks/transform_base_template'));

gulp.task('mkdir_static', mkdirTask('static'));
gulp.task('mkdir_local_static', mkdirTask('local_static'));

gulp.task('collect_all_templates', require('./gulp_tasks/collect_all_templates'));
gulp.task('collectstatic', ['mkdir_static', 'mkdir_local_static'], require('./gulp_tasks/collectstatic'));


/////////////////////////////////////////////////////////////////
///                  ALLEGATION APP TASKS                     ///
/////////////////////////////////////////////////////////////////
gulp.task('build_allegation_js_minified', buildAllegationJSTask(true));
gulp.task('build_allegation_js', buildAllegationJSTask(false));

gulp.task('build_allegation_sass', buildAllegationCSSTask(false, true));
gulp.task('compile_allegation_sass', buildAllegationCSSTask(true, false));
gulp.task('circle_allegation_sass', buildAllegationCSSTask(false, false));

gulp.task('transform_allegation_template', ['build_allegation_sass', 'build_allegation_js_minified'],
  require('./gulp_tasks/transform_allegation_template'));

gulp.task('transform_allegation_base_template', require('./gulp_tasks/transform_allegation_base_template'));

gulp.task('collect_bower_fonts', require('./gulp_tasks/collect_bower_fonts'));

gulp.task('watch_allegation_js', require('./gulp_tasks/watch_allegation_js'));

gulp.task('watch_allegation_sass', ['compile_allegation_sass'], function () {
  gulp.watch('./common/static/sass/**/*', ['compile_allegation_sass']);
});

gulp.task('build_allegation', ['transform_allegation_template']);

gulp.task('watch_allegation', ['compile_test_sass', 'watch_allegation_js', 'watch_allegation_sass']);


/////////////////////////////////////////////////////////////////
///                   DASHBOARD APP TASKS                     ///
/////////////////////////////////////////////////////////////////
gulp.task('transform_dashboard_template', ['build_dashboard_sass', 'build_dashboard_js_minified'],
  require('./gulp_tasks/transform_dashboard_template'));

gulp.task('build_dashboard_sass', buildDashboardCSSTask(false, true));
gulp.task('compile_dashboard_sass', buildDashboardCSSTask(true, false));
gulp.task('circle_dashboard_sass', buildDashboardCSSTask(false, false));

gulp.task('build_dashboard_js', buildDashboardJSTask(false));
gulp.task('build_dashboard_js_minified', buildDashboardJSTask(true));

gulp.task('watch_dashboard_js', require('./gulp_tasks/watch_dashboard_js'));
gulp.task('watch_dashboard_sass', ['compile_dashboard_sass'], function () {
  gulp.watch('./dashboard/static/dashboard/sass/**/*', ['compile_dashboard_sass']);
});

gulp.task('watch_dashboard', ['compile_test_sass', 'watch_dashboard_js', 'watch_dashboard_sass']);
gulp.task('build_dashboard', ['transform_dashboard_template']);


/////////////////////////////////////////////////////////////////
///                    MOBILE APP TASKS                       ///
/////////////////////////////////////////////////////////////////
gulp.task('transform_mobile_template', ['build_mobile_sass', 'build_mobile_js_minified'],
  require('./gulp_tasks/transform_mobile_template')
);

gulp.task('build_mobile_sass', buildMobileCSSTask(false, true));
gulp.task('compile_mobile_sass', buildMobileCSSTask(true, false));
gulp.task('circle_mobile_sass', buildMobileCSSTask(false, false));

gulp.task('build_mobile_js', buildMobileJSTask(false));
gulp.task('build_mobile_js_minified', buildMobileJSTask(true));

gulp.task('watch_mobile_js', require('./gulp_tasks/watch_mobile_js'));
gulp.task('watch_mobile_sass', ['compile_mobile_sass'], function () {
  gulp.watch('./mobile/static/mobile/sass/**/*', ['compile_mobile_sass']);
});

gulp.task('watch_mobile', ['compile_test_sass', 'watch_mobile_js', 'watch_mobile_sass']);
gulp.task('build_mobile', ['transform_mobile_template']);


/////////////////////////////////////////////////////////////////
///                   SUNBURST APP TASKS                      ///
/////////////////////////////////////////////////////////////////
gulp.task('transform_sunburst_template', ['build_allegation_sass', 'build_sunburst_js_minified'],
  require('./gulp_tasks/transform_sunburst_template'));

gulp.task('build_sunburst_js', buildSunburstJSTask(false));
gulp.task('build_sunburst_js_minified', buildSunburstJSTask(true));

gulp.task('build_sunburst', ['transform_sunburst_template']);



gulp.task('circleci', function (done) {
  runSequence('collectstatic', [
    'circle_test_sass', 'build_allegation_js', 'build_dashboard_js', 'build_mobile_js', 'build_sunburst_js',
    'circle_mobile_sass', 'circle_dashboard_sass', 'circle_allegation_sass'
  ], done);
});
gulp.task('build', function (done) {
  runSequence(
    ['collectstatic', 'collect_all_templates'],
    'collect_bower_fonts', 'build_allegation',
    'transform_allegation_base_template', 'transform_base_template',
    'build_sunburst', 'build_mobile', 'build_dashboard', done
  );
});
