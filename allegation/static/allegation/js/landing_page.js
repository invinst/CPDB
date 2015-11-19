(function(){
  var $welcome = $('.welcome');
  var $subNav = $('.sub-nav');
  var $body = $('body');
  var $landingPageContainer = $("#landing-page");
  var $landingNav = $('.landing-nav');
  var $main = $('.main');
  var $cpdpLogo = $('.cpdp-logo');
  var $iiLogo = $('.page-logo');
  var $findingBtn = $('.view-findings');
  var $mapSection = $('.map-section');
  var $movingArrow = $('.moving-arrow');
  var navBarHeight = 90;

  function syncNavState() {
    var navItems = $('.landing-nav .sub-nav a');
    var currentPos = $(window).scrollTop() + navBarHeight;
    var breakloop = false;
    for(var index = 0; index < navItems.length; index++) {
      var item = $(navItems[index]);
      var $control = $(item.data('target'));
      if (currentPos >= $control.offset().top) {
        navItems.removeClass('active');
        item.addClass('active');
        break;
      }
    }
  }

  function toggleShow() {
    var scrollTop = $(window).scrollTop();
    var cond = scrollTop >= $welcome.height();
    $landingNav.toggleClass('fixed-nav', cond);
    $landingNav.toggleClass('border-top', scrollTop != 0);
    $main.toggleClass('margin-top-90', cond);
    var opacity = scrollTop / $welcome.height()
    $cpdpLogo.css('opacity', opacity);
    $iiLogo.css('opacity', 1 - opacity);
    syncNavState();
  }

  function scrollTop(callback, elapseTime) {
    $body.animate({
      scrollTop: 0
    }, elapseTime, callback);
  }

  function getScrollTime() {
    return Math.min(500, $body.scrollTop());
  }

  function onScrollTopFindPage() {
    $landingPageContainer.removeClass('scroll-to-top');
    toggleShow();
    onScrollTop();
  }

  function onScrollTop() {
    $(window).on('scroll', toggleShow);
  }

  $(window).on('scroll', toggleShow);

  $(document).on('click', '.story-nav a', function() {
    $element = $($(this).data('target'));
    $body.animate({
        scrollTop: $element.offset().top - navBarHeight
    }, 1000);
    return false;
  });

  $('.landing-nav a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $target = $(e.target);
    var currentPage = $target.attr('href');
    $(window).off('scroll');
    if (currentPage == '#findings') {
      scrollTop(onScrollTopFindPage, getScrollTime());
    } else {
      $landingPageContainer.addClass('scroll-to-top');
      scrollTop(onScrollTop, 1000);
    }
  });

  $('.tab-navigate').on('click', function() {
    var tab = $(this).attr('tab-navigate');
    $('a[aria-controls=' + tab + ']').trigger('click');
    return false;
  });

  $findingBtn.on('click', function() {
    $body.animate({
        scrollTop: $mapSection.offset().top - 45
    }, 1000);
    return false;
  });
}());
