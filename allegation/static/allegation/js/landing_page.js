var $welcome = $('.welcome');
var $subNav = $('.sub-nav');
var $body = $('#landing-page');
var $landingNav = $('.landing-nav');
var $main = $('.main');
var scrollValue = 343;

function toggleShow() {
  var cond = $(window).scrollTop() >= scrollValue;
  $landingNav.toggleClass('fixed-nav', cond);
  $main.toggleClass('margin-top-90', cond);
  $subNav.toggleClass('hidden', !cond);
}

function scrollTop(callback) {
  $body.animate({
    scrollTop: 0
  }, 1000, callback);
}

$(window).on('scroll', toggleShow);

$(document).on('click', '.story-nav a', function() {
  $element = $($(this).data('target'));
  $('body').animate({
      scrollTop: $element.offset().top - 90
  }, 1000);
  return false;
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  var currentPage = $(e.target).attr('href');
  $(window).off('scroll');

  if (currentPage == '#story-page') {
    $subNav.html($('.story-nav').clone());
  }

  if (currentPage == '#find-page') {
    scrollValue = 343;
    $subNav.html('');
    $body.animate({
      scrollTop: 0
    }, Math.min(500, $('body').scrollTop()), function() {
      toggleShow();
      $body.removeClass('scroll-to-top');
      $(window).on('scroll', toggleShow);
    });
  } else {
    scrollValue = 0;
    $subNav.html('');
    $body.addClass('scroll-to-top');
    scrollTop(function() {
      $(window).on('scroll', toggleShow);
    });
  }
});

$('.tab-navigate').on('click', function() {
  var tab = $(this).attr('tab-navigate');
  $('a[aria-controls=' + tab + ']').trigger('click');
  return false;
});
