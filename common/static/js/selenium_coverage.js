blanket.options({
  timeout: 30000,
  reporter: 'string'
});

blanket.customReporter=function(coverage_results){
    window.coverage_results;
};

blanket.beforeStartTestRunner({
    callback: function(){
        blanket.setupCoverage();
        blanket.onTestStart();
        init_react();
    }
});
