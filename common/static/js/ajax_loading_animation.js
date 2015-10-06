/**
 * Created by eastagile on 8/3/15.
 */
;
(function ($) {
  var ajaxCallCount = 0;
  var finishAjaxCallCount = 0;

  var bar = $("<div class='loading-animation'></div>");
  $("body").append(bar);

  function show(){
    var percent = finishAjaxCallCount * 100 / ajaxCallCount;
    bar.css({
      opacity: 1,
      width: percent.toFixed() + '%'
    });
  }

  function hide(){
    bar.css('opacity', 0);
    ajaxCallCount = finishAjaxCallCount = 0;
    setTimeout(function () {
      bar.css('width', 0);
    }, 1000);
  }

  function update(){
    show();
  }

  function add(weight){
    weight = weight || 1;
    ajaxCallCount += weight;
    update();
  }

  function remove(weight){
    weight = weight || 1;
    finishAjaxCallCount += weight;
    update();
  }

  $(document).bind("ajaxSend", function (xhr, status, options) {
    add(options.weight);
  }).bind("ajaxComplete", function (xhr, status, options) {
    remove(options.weight);
  }).bind("ajaxStop", function () {
    hide();
  });
})(jQuery);
