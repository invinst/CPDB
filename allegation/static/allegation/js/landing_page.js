function toggleShow(cond) {
  $('.landing-nav').toggleClass('fixed-nav', cond);
  $('.main').toggleClass('margin-top-90', cond);
  $('.sub-nav').toggleClass('hidden', !cond);
}

$(window).on('scroll', function(e) {
  toggleShow($(window).scrollTop() >= 268);
});

$(document).on('click', '.story-nav a', function() {
  $element = $($(this).data('target'));
  $('html, body').animate({
      scrollTop: $element.offset().top - 90
  }, 1000);
  return false;
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  if ($(e.target).attr('href') == '#story-page') {
    $('.sub-nav').html($('.story-nav').clone());
  } else {
    $('.sub-nav').html('');
  }
})
