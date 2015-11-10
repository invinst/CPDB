window.$welcome = $('.welcome');
window.$subNav = $('.sub-nav');
window.scrollValue = 243;

function toggleShow() {
  var cond = $(window).scrollTop() >= scrollValue;
  $('.landing-nav').toggleClass('fixed-nav', cond);
  $('.main').toggleClass('margin-top-90', cond);
  $subNav.toggleClass('hidden', !cond);
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
  if (currentPage == '#story-page') {
    $welcome.slideUp('slow');
    $subNav.html($('.story-nav').clone());
    scrollValue = 0;
  } else if (currentPage == '#find-page') {
    $welcome.slideDown('slow');
    $subNav.html('');
    scrollValue = 243;
  } else {
    $welcome.slideUp('slow');
    $subNav.html('');
    scrollValue = 0;
  }
})

$('.tab-navigate').on('click', function() {
  var tab = $(this).attr('tab-navigate');
  $('a[aria-controls=' + tab + ']').trigger('click');
  $('html, body').animate({
      scrollTop: 0
  }, 1000);
  return false;
});
