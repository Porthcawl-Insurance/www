/*
Sample URL parameters

CyberFortress:
?id=f58f0b44-7b20-5fed-b0aa-dc353b89c630

Codeup:
?id=b1049048-ef36-5d15-85e3-33f1c6dd3518

*/

'use strict';

$(function() {

  // Retrieve a specific URL parameter.
  function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  };

  // Attempt to read the "id" parameter.
  // If it is available, update Local Storage and call the API function to populate the RS data.
  // If not, attempt to read from Local Storage.
  // If still unavailable, present the user with an error.
  var _domain_id = getURLParameter ('id');
  if (_domain_id) {
    // Call API function to populate RS data with id = _domain_id
    localStorage.setItem ('_domain_id', _domain_id);
    var data = { id: _domain_id }
    getData (data);
  } else {
    var _domain_id = localStorage.getItem ('_domain_id')
    if (_domain_id) {
      // TODO: Call API function to populate RS data with id = _domain_id
      var data = { id: _domain_id }
      getData(data);
    } else {
      // TODO: Display an error stating that no RS data is available ... Same error as when the API call returns a 404.
      $('#jumbotron-loading').addClass ('d-none');
      $('#jumbotron-error').removeClass ('d-none');
    }
  }

  function getData(data) {
    $.ajax({
      method: "POST",
      url: "https://us-central1-cyberfortress-sandbox.cloudfunctions.net/rs",
      contentType: "application/json",
      data: JSON.stringify(data),
    }).done(function(response) {
      populate(response);
			$('#jumbotron-loading').addClass ('d-none');
			$('#jumbotron-score').removeClass ('d-none');
			$('#summary-div').removeClass ('d-none');
    }).fail(function(e) {
      console.log(e)
			$('#jumbotron-loading').addClass ('d-none');
			$('#jumbotron-error').removeClass ('d-none');
    });
  }

  // populate fields with info from json obj
  function populate(result) {
    var domain = result.domain,
      score = result.score,
      date = new Date(result.model.ts * 1000),
      conts = result.top_contributions,
      url = $(location).attr('href');

    $('#domain').text(domain);
    $('#score').html('<span>' + score + '</span> / 10 ');
    $('#score-message').text('as of ' + date.toLocaleDateString());
    $('#copy-url').val(url);

    fillRook(score);
    topFactors(conts);
    categorizeFactors(conts);
    popFactorSummary(conts);
    popSummary(conts);
  }

  // color rook based on score
  function fillRook(score) {
    var getScoreColor = d3.scaleQuantize()
      .domain([0, 6])
      .range(['#CC444B', '#D8774F', '#DE9151', '#E9B15D', '#FFF275', '#D3E468', '#7AC74F']);

    var getScoreRow = d3.scaleLinear()
      .domain([0, 10])
      .range([0, 6]);

    // Note that the group or <g> elements in the rook's svg are ordered backwards
    d3.select("#rook-svg").selectAll(".row")
      .transition()
      .delay(function(d, i) {
        return i * 100
      })
      .duration(1500)
      .style('fill', function(d, i) {
        if (i < getScoreRow(score)) {
          return getScoreColor(getScoreRow(score));
        }
      });
  }

  // get top & bottom factors
  function topFactors(conts) {
    var top = [conts[0], conts[1], conts[2]];
    var bottom = getBottomFactors(conts);

    $(top).each(function(i) {
      var name = this.name,
        tag = this.tag,
        desc = this.description,
        summary = this.summary,
        weight = this.weight_normalized,
        icon = getIcon(tag),
        color = getColor(weight),
        collapseId = i + 't-collapse';

      $('#top-factors').append(
        '<div class="d-flex flex-row flex-nowrap align-items-start">' +
        '<div class="icon-div pt-2">' +
        '<p class="icon ' + color + ' text-center">' +
        '<span class="fa-stack">' +
        '<i class="fa fa-circle fa-stack-2x icon-background"></i>' +
        '<i class="' + icon + ' fa-stack-1x"></i></span></p></div>' +
        '<div class="text-div">' +
        '<p class="f-name">' + name + ' <span>[ ' + tag + ' ]</span>' +
        '</p>' +
        '<p class="f-desc">' + summary + '</p>' +
        '</div></div>'
      );
    });

    $(bottom).each(function(i) {

      var name = this[0].name,
        tag = this[0].tag,
        desc = this[0].description,
        summary = this[0].summary,
        weight = this[0].weight_normalized,
        icon = getIcon(tag),
        color = getColor(weight),
        collapseId = i + 'b-collapse';


      $('#bottom-factors').append(
        '<div class="d-flex flex-row flex-nowrap align-items-start">' +
        '<div class="icon-div pt-2">' +
        '<p class="icon ' + color + ' text-center">' +
        '<span class="fa-stack">' +
        '<i class="fa fa-circle fa-stack-2x icon-background"></i>' +
        '<i class="' + icon + ' fa-stack-1x"></i></span></p></div>' +
        '<div class="text-div">' +
        '<p class="f-name">' + name + ' <span>[ ' + tag + ' ]</span>' +
        '</p>' +
        '<p class="f-desc">' + summary + '</p>' +
        '</div></div>'
      );
    });

    function getBottomFactors(conts) {
      var clone = conts.slice(0), //clone array as to not change orignal conts[]
        lastConts = [],
        step;

      for (step = 0; step < 3; step++) { // get .last(), then .pop() from clone, 3x
        var lCont = $(clone).last();
        lastConts.push(lCont);
        clone.pop(lCont);
      }

      return lastConts;
    }

  }

  // categorize factors by tag
  function categorizeFactors(conts) {
    var factorGrps = $('.factor-grp'),
      factorList = $('.factor-list');

    $(conts).each(function() {
      var tag = this.tag;

      if (tag === 'web-server') {
        tag = 'server';
      }

      $('#rs-' + tag).append(
        '<p class="rs-factor">' + this.name + '</p>'
      );

    });

    // if factor group has nothing listed, hide it
    $(factorGrps).each(function(i) {
      if ($(this).children().length <= 2) {
        $(this).hide();
      }
    });
  }

  function popFactorSummary(conts) {
    $(conts).each(function() {
      var desc = this.description,
        name = this.name,
        summary = this.summary,
        tag = this.tag,
        weight = this.weight_normalized,
        icon = getIcon(tag),
        color = getColor(weight);

      if (name != null) {
        $('#factor-info').append(
          "<div class='factor-sum d-flex flex-row justify-content-start'>" +
          "<div class='icon-div'>" +
          "<p class='icon " + color + " text-center'>" +
          "<span class='fa-stack'>" +
          "<i class='fa fa-circle fa-stack-2x icon-background'></i>" +
          "<i class='" + icon + " fa-stack-1x'></i>" +
          "</span></p>" +
          "</div>" +
          "<div class='text-div d-flex flex-column " + color + "'>" +
          "<div class='name-div'>" +
          "<p class='f-title'>" + name + " <span class='f-tag'>[ " + tag + " ]</span></p>" +
          "</div>" +
          "<div class='desc-div'>" +
          "<p class='f-sum'>" + summary + "</p>" +
          "<p class='f-desc'>" + desc + "</p>" +

          "</div></div></div>");
      }
    });
  }

  // create summary
  function popSummary(conts) {

    // don't include the top three
    var otherFactors = conts.slice(3);

    var widgets = [],
      framework = [],
      hosting = [],
      cms = [],
      shop = [],
      mx = [],
      payment = [],
      webServer = [],
      ssl = [],
      cdn = [],
      server = [];

    $(otherFactors).each(function() {

      var desc = this.description,
        name = this.name,
        summary = this.summary,
        tag = this.tag,
        weight = this.weight,
        icon = getIcon(tag),
        color;

      if (name != null && tag != 'ns') {

        switch (tag) {
          case 'widgets':
            widgets.push(this);
            break;
          case 'framework':
            framework.push(this);
            break;
          case 'hosting':
            hosting.push(this);
            break;
          case 'cms':
            cms.push(this);
            break;
          case 'shop':
            shop.push(this);
            break;
          case 'mx':
            mx.push(this);
            break;
          case 'payment':
            payment.push(this);
            break;
          case 'web-server':
            webServer.push(this);
            break;
          case 'ssl':
            ssl.push(this);
            break;
          case 'cdn':
            cdn.push(this);
            break;
          case 'server':
            server.push(this);
            break;
        }

        if (summary.indexOf('positive') >= 0) {
          color = 'r7';
        } else if (summary.indexOf('negative') >= 0) {
          color = 'r1';
        }

        $('#cat-info').append(
          "<div class='cat long d-flex flex-row justify-content-between'>" +
          "<div class='icon-div'>" +
          "<p class='icon " + color + " text-center'>" +
          "<span class='fa-stack'>" +
          "<i class='fa fa-circle fa-stack-2x icon-background'></i>" +
          "<i class='" + icon + " fa-stack-1x'></i>" +
          "</span></p>" +
          // "<p class='c-tag'>" + tag + "</p>" +
          "</div>" +
          "<div class='text-div'>" +
          "<p class='c-title'>" + name + "</p>" +
          "<p class='c-desc'>" + desc + "</p>" +
          "</div>" +
          "<div class='sum-div'>" +
          "<p class='c-sum'>" + summary + "</p>" +
          "</div></div>");
      }

    }); //end of .each()

  }

  // return icon class based on tag
  function getIcon(tag) {
    var icon;
    switch (tag) {
      case 'widgets':
        icon = 'fal fa-tachometer-alt-slow';
        break;
      case 'framework':
        icon = 'fal fa-chart-network';
        break;
      case 'hosting':
        icon = 'fal fa-cloud';
        break;
      case 'ssl':
        icon = 'fal fa-shield-alt';
        break;
      case 'cms':
        icon = 'fal fa-cog';
        break;
      case 'cdn':
        icon = 'fal fa-globe';
        break;
      case 'shop':
        icon = 'fal fa-shopping-cart';
        break;
      case 'mx':
        icon = 'fal fa-fingerprint';
        break;
      case 'server':
        icon = 'fal fa-server';
        break;
      case 'web-server':
        icon = 'fal fa-server';
        break;
      case 'payment':
        icon = 'fal fa-money-bill-wave'
        break;
      default:
        icon = 'fal fa-laptop-code';
    }
    return icon;
  }

  // color by weight
  function getColor(weight) {
    var color;

    switch (true) {
      case (weight <= 0.143):
        color = 'r7';
        break;
      case (weight <= 0.286):
        color = 'r6';
        break;
      case (weight <= 0.429):
        color = 'r5';
        break;
      case (weight <= 0.572):
        color = 'r4';
        break;
      case (weight <= 0.715):
        color = 'r3';
        break;
      case (weight <= 0.858):
        color = 'r2';
        break;
      case (weight <= 1):
        color = 'r1';
        break;
    }

    return color;
  }

  //share score link
  $('#share-score').click(function(e) {
    e.preventDefault;
    var urlField = $('#copy-url');
    urlField.select();
    document.execCommand("copy");
    console.log(urlField.val());
    // alert("Copied the text: " + urlField.val());
  });

  // scroll to full summary btn function
  $('#full-summary').click(function() {
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#summary-div").offset().top
    }, 1000);
  });

});
