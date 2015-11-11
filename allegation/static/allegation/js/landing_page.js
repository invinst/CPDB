window.$welcome = $('.welcome');
window.$subNav = $('.sub-nav');
window.scrollValue = 343;

function toggleShow() {
  var cond = $(window).scrollTop() >= scrollValue;
  $('.landing-nav').toggleClass('fixed-nav', cond);
  $('.main').toggleClass('margin-top-90', cond);
  $subNav.toggleClass('hidden', !cond);
}

function scrollTop(callback) {
  $('body').animate({
    scrollTop: 0
  }, 300, callback);
}

$(window).on('scroll', toggleShow);

$(document).on('click', '.story-nav a', function() {
  $element = $($(this).data('target'));
  $('html, body').animate({
      scrollTop: $element.offset().top - 90
  }, 1000);
  return false;
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

  var currentPage = $(e.target).attr('href');

  if (currentPage != '#find-page' && $('body').scrollTop() > 343) { // Hide Welcome before animate if it does not appear on current view port
    $welcome.hide()
  }

  if (currentPage == '#story-page') {
    $welcome.slideUp('slow', function() {
      scrollTop()
    })
    scrollValue = 0;
  } else if (currentPage == '#find-page') {
    $subNav.html('');
    scrollValue = 343;
    scrollTop(function() {
      $welcome.slideDown('slow');
    });
    toggleShow();
  } else {
    $welcome.slideUp('slow', function() {
      scrollTop()
    })
    $subNav.html('');
    scrollValue = 0;
  }
})

$('.tab-navigate').on('click', function() {
  var tab = $(this).attr('tab-navigate');
  $('a[aria-controls=' + tab + ']').trigger('click');
  return false;
});
