'use strict'

$(function() {

  // ------ Handle Footer Height -------//
  $(document).ready(function() {

    var footerHeight = $('footer').height();
    console.log(footerHeight);
    $('body').css('paddingBottom', footerHeight);

  });

  $(window).resize(function() {
    var footerHeight = $('footer').height();
    console.log(footerHeight);
    $('body').css('paddingBottom', footerHeight);
  });

});
