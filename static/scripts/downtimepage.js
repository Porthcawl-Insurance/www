'use strict';

$(function() {

  // ------------------------ CATEGROIES ---- //

  var categories = [{
      name: 'Widgets',
      icon: 'fal fa-tachometer-alt-slow',
      desc: 'Simple application extensions',
      modId: 'widgets'
    },
    {
      name: 'SSL',
      icon: 'fal fa-shield-alt',
      desc: 'Standard security technology',
      modId: 'ssl'
    },
    {
      name: 'Hosting',
      icon: 'fal fa-cloud',
      desc: 'Technology & service provider',
      modId: 'hosting'
    },
    {
      name: 'CDN',
      icon: 'fal fa-globe',
      desc: 'Content delivery network',
      modId: 'cdn'
    },
    {
      name: 'Framework',
      icon: 'fal fa-chart-network',
      desc: 'Your digital foundation',
      modId: 'framework'
    },
    {
      name: 'CMS',
      icon: 'fal fa-cog',
      desc: 'Content Management',
      modId: 'cms'
    },
    {
      name: 'Shop',
      icon: 'fal fa-shopping-cart',
      desc: 'eCommerce software',
      modId: 'shop'
    },
    {
      name: 'MX',
      icon: 'fal fa-fingerprint',
      desc: 'Mail exchange records',
      modId: 'mx'
    },
    {
      name: 'Payment',
      icon: 'fal fa-money-bill-wave',
      desc: 'Online payment system',
      modId: 'payment'
    },
    {
      name: 'Web Server',
      icon: 'fal fa-server',
      desc: 'Something about servers',
      modId: 'server'
    }
  ];

  function populateEffects() {

    $(categories).each(function(i) {

      var icon = this.icon,
        name = this.name,
        desc = this.desc,
        modId = this.modId;

      $('#what-effects').append(
        "<div class='cat min'>" +
        "<p class='icon'><i class='" + icon + "'></i></p>" +
        "<p class='c-title'>" + name + "</p>" +
        "<p class='desc'>" + desc + "</p>" +
        // "<a id='" + modId + "' tabindex='0' class='btn tip' role='button' data-toggle='modal' data-target='#cat-modal'><i class='fas fa-question-circle'></i></a>" +
        "</div>"
      );
    });
  }
  populateEffects();

  // --------------------------- MODALS ---- //

  var id = '';

  $('.btn.tip').click(function() {
    return id = $(this).attr('id');
  });

  $("#cat-modal").on('show.bs.modal', function() {

    var mTitle = $('#m-title'),
      mIcon = $('#m-icon'),
      mHeader = $('#m-header'),
      mContent = $('#m-content');

    switch (id) {
      case 'widgets':
        mIcon.html('<i class="' + categories[0].icon + '"></i>');
        mTitle.text(categories[0].name);

        break;
      case 'ssl':
        mIcon.html('<i class="' + categories[1].icon + '"></i>');
        mTitle.text(categories[1].name);
        break;
      case 'hosting':
      mIcon.html('<i class="' + categories[2].icon + '"></i>');
      mTitle.text(categories[2].name);
        break;
      case 'cdn':
      mIcon.html('<i class="' + categories[3].icon + '"></i>');
      mTitle.text(categories[3].name);
        break;
      case 'framework':
      mIcon.html('<i class="' + categories[4].icon + '"></i>');
      mTitle.text(categories[4].name);
        break;
      case 'cms':
      mIcon.html('<i class="' + categories[5].icon + '"></i>');
      mTitle.text(categories[5].name);
        break;
      case 'shop':
      mIcon.html('<i class="' + categories[6].icon + '"></i>');
      mTitle.text(categories[6].name);
        break;
      case 'mx':
      mIcon.html('<i class="' + categories[7].icon + '"></i>');
      mTitle.text(categories[7].name);
        break;
      case 'payment':
      mIcon.html('<i class="' + categories[8].icon + '"></i>');
      mTitle.text(categories[8].name);
        break;
      case 'server':
      mIcon.html('<i class="' + categories[9].icon + '"></i>');
      mTitle.text(categories[9].name);
        break;
    }
  });

  $('.btn-tip').click(function() {

    var id = $(this).attr('id');

    var mTitle = $('#m-title'),
      mHeader = $('#m-header'),
      mContent = $('#m-content');

    switch (id) {
      case 'widgets':
        mTitle.html(categories[0].name + '<i class="' + categories[0].icon + '"></i>');

        break;
      case 'ssl':
        break;
      case 'hosting':
        break;
      case 'cdn':
        break;
      case 'framework':
        break;
      case 'cms':
        break;
      case 'shop':
        break;
      case 'mx':
        break;
      case 'payment':
        break;
      case 'server':
        break;
    }
  });

});
