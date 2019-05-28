'use strict'

$(function() {

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
