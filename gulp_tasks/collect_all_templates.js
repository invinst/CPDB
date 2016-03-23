var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

var isNotHidden = function (dirName) {
  return dirName.indexOf('.') !== 0;
};

var isModule = function (srcPath) {
  return fs.statSync(srcPath).isDirectory()
    && fs.existsSync(path.join(srcPath, '__init__.py'));
};

var hasTemplate = function (srcPath) {
  return fs.existsSync(path.join(srcPath, 'templates'));
};

var getTemplateDir = function (basePath) {
  var resultDirs = [];
  var srcPath;

  var listApp = fs.readdirSync(basePath);

  listApp.forEach(function (file) {
    srcPath = path.join(basePath, file);
    if (isNotHidden(srcPath) && isModule(srcPath) && hasTemplate(srcPath)) {
      resultDirs.push(path.join(srcPath,'templates/**/*'));
    }
  });
  return resultDirs;
};


module.exports = function () {
  return gulp.src(getTemplateDir('.'))
    .pipe(gulp.dest('templates'));
};
