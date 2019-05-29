'use strict'

$(function() {


  // Intercom Chat //
  $('.intercom-launcher-open-icon').css('backgroundColor', 'black');

  // Team Photos //
  $('.figure-img').click(function() {
    // Go to LinkedIn Page on click
    var link = $(this).siblings('.figure-caption').find('a').attr('href');
    window.location.href = link;
    // window.open(link);
  });

  $('.figure-img').hover(function() {
    var link = $(this).siblings('.figure-caption').find('a');
    $(link).css('fontWeight', 'bold');
  }, function() {
    var link = $(this).siblings('.figure-caption').find('a');
    $(link).css('fontWeight', '400');
  });


  // ------ Handle Footer Height -------//
  $(document).ready(function() {

    var footerHeight = $('footer').height();
    $('body').css('paddingBottom', footerHeight);

  });

  $(window).resize(function() {
    var footerHeight = $('footer').height();
    $('body').css('paddingBottom', footerHeight);
  });

});
