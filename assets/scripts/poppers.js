'use strict';

$(function() {

// --------- Initialize Poppers -------//
$(function() {
  $('[data-toggle="popover"]').popover();
});

$('#emailEx-popover').popover({
  // title: 'Business vs. Personal',
  content: '<div id="emailEx"><p class="yes"><i class="fas fa-check-circle yes"></i> your.name@<span class="bold yes">yourbusiness.com</span></p><p class="no"><i class="fas fa-times-circle no"></i> your.name@<span class="bold">gmail.com</span></p></div>',
  html: true,
  placement: 'right'
});

// $('#widgets').popover({
//   content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae commodo est. Integer ac odio non orci maximus tempor quis sed nisi.</p>',
//   html: true,
//   placement: 'top'
// });

});
