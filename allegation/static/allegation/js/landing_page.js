function toggleShow(cond) {
  $('.landing-nav').toggleClass('fixed-nav', cond);
  $('.main').toggleClass('margin-top-90', cond);
  $('.sub-nav').toggleClass('hidden', !cond);
}

$(window).on('scroll', function(e) {
  toggleShow($(window).scrollTop() >= 268);
});
