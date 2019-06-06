// Form validation - with Bootstrap 4//
(function () {
	'use strict';

	window.addEventListener ('load', function () {
		// Fetch all the forms we want to apply custom Bootstrap validation styles to
		var forms = document.getElementsByClassName ('needs-validation');

		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call (forms, function (form) {
			form.addEventListener ('submit', function (e) {
				if (form.checkValidity () === false) {
					e.preventDefault ();
					e.stopPropagation ();
				}
				form.classList.add ('was-validated');
			}, false);
		});
	}, false);
})();

/*
// Team Photos
$(function() {
  $('.figure-img').click(function() {
    // Go to LinkedIn Page on click
    var link = $(this).siblings('.figure-caption').find('a').attr('href');
    window.location.href = link;
  });

  $('.figure-img').hover(function() {
    var link = $(this).siblings('.figure-caption').find('a');
    $(link).css('fontWeight', 'bold');
  }, function() {
    var link = $(this).siblings('.figure-caption').find('a');
    $(link).css('fontWeight', '400');
  });
})();
*/

// Footer height
(function () {
	var footerHeight = $('footer').height ();
	$('body').css ('paddingBottom', footerHeight);

  $(window).resize (function () {
    var footerHeight = $('footer').height ();
    $('body').css('paddingBottom', footerHeight);
  });
})();

