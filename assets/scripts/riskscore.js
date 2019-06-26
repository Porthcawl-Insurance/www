/*
Sample URL parameters

CyberFortress:
?id=f58f0b44-7b20-5fed-b0aa-dc353b89c630

Codeup:
?id=b1049048-ef36-5d15-85e3-33f1c6dd3518

*/

// Append script to the bottom of the body to call genRiskscore after the document is ready
/*
(function () {
	var s = document.createElement ('script');
	s.text = 'genRiskscore ();';
	document.getElementsByTagName ("body")[0].append (s);
})();
*/

(function() {
  'use strict';

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
  var _domain_id = getURLParameter('id');
  if (_domain_id) {
    // Call API function to populate RS data with id = _domain_id
    localStorage.setItem('_domain_id', _domain_id);
    var data = {
      id: _domain_id
    }
    getData(data);
  } else {
    var _domain_id = localStorage.getItem('_domain_id')
    if (_domain_id) {
      var data = {
        id: _domain_id
      }
      getData(data);
    } else {
      $('#jumbotron-loading').addClass('d-none');
      $('#jumbotron-error').removeClass('d-none');
    }
  }

  // get score info
  function getData(data) {
    $.ajax({
      method: "POST",
      url: "https://us-central1-cyberfortress-sandbox.cloudfunctions.net/rs",
      contentType: "application/json",
      data: JSON.stringify(data),
    }).done(function(response) {
      populate(response);
      $('#jumbotron-loading').addClass('d-none');
      $('#jumbotron-score').removeClass('d-none');
      $('#summary-div').removeClass('d-none');
      $('#whatsgood-div').removeClass('d-none');
    }).fail(function(e) {
      console.log(e)
      $('#jumbotron-loading').addClass('d-none');
      $('#jumbotron-error').removeClass('d-none');
    });
  }

  // populate fields with info from json obj
  function populate(result) {
    var result = result,
      domain = result.domain,
      score = result.score,
      date = new Date(result.ts_p * 1000),
      conts = result.top_contributions,
      url = document.location.host + document.location.pathname + '?id=' + _domain_id,
      timestamp = result.ts_p;

      var positiveTags = Array();
      var negativeTags = Array();

    $('#domain').text(domain);
    $('#score').html('<span>' + score + '</span> / 10 ');
    $('#score-message').text('as of ' + date.toLocaleDateString());
    $('#copy-url').text(url);

    getWhatsGood(result);
    fillRook(score);
    topFactors(conts, positiveTags, negativeTags);
    popFactorSummary(conts);

    console.log('postiive tags returned --> ' + positiveTags);
    console.log('negative tags returned --> ' + negativeTags);
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
        if (i <= getScoreRow(score)) {
          return getScoreColor(getScoreRow(score));
        }
      });
  }

  // get top positively and negatively contributing factors
  function topFactors(conts, positiveTags, negativeTags) {
    var positiveFactors = Array();
    var negativeFactors = Array();

    conts.forEach(function(item) {
      if (item.weight <= 0) {
        positiveFactors.push(item);
      } else {
        negativeFactors.push(item);
      }
    });

    // Sort & slice appropriately
    var limit = 3;
    positiveFactors = positiveFactors.sort(function(a, b) {
      return a.weight - b.weight
    }).slice(0, 3);
    negativeFactors = negativeFactors.sort(function(a, b) {
      return b.weight - a.weight
    }).slice(0, 3);

    if (positiveFactors.length) {
      $(positiveFactors).each(function(i) {
        var name = this.name,
          tag = this.tag,
          desc = this.description,
          summary = this.summary,
          weight = this.weight_normalized,
          icon = getIcon(tag),
          color = getColor(weight),
          collapseId = i + 't-collapse';

          if ($.inArray(tag, positiveTags) === -1) {
            positiveTags.push(tag);
          }

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
    } else {  // if no positive factors exist
      $('#top-factors').append(
        '<div class="d-flex flex-row flex-nowrap align-items-start">' +
        '<div class="icon-div pt-2">' +
        '<p class="icon none text-center">' +
        '<span class="fa-stack">' +
        '<i class="fa fa-circle fa-stack-2x icon-background"></i>' +
        '<i class="fal fa-times fa-stack-1x"></i></span></p></div>' +
        '<div class="text-div">' +
        '<p class="f-name">None</p>' +
        '<p class="f-desc">When calculating your score, no significant positive contributions were included.</p>' +
        '</div>' +
        '</div>'
      );
    }

    if (negativeFactors.length) {
      $(negativeFactors).each(function(i) {
        var name = this.name,
          tag = this.tag,
          desc = this.description,
          summary = this.summary,
          weight = this.weight_normalized,
          icon = getIcon(tag),
          color = getColor(weight),
          collapseId = i + 't-collapse';

          if ($.inArray(tag, negativeTags) === -1) {
            negativeTags.push(tag);
          }

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
    } else { // if no negative factors exist
      $('#bottom-factors').append(
        '<div class="d-flex flex-row flex-nowrap align-items-start">' +
        '<div class="icon-div pt-2">' +
        '<p class="icon none text-center">' +
        '<span class="fa-stack">' +
        '<i class="fa fa-circle fa-stack-2x icon-background"></i>' +
        '<i class="fal fa-times fa-stack-1x"></i></span></p></div>' +
        '<div class="text-div">' +
        '<p class="f-name">None</p>' +
        '<p class="f-desc">When calculating your score, no significant negative contributions were included.</p>' +

        '</div>' +
        '</div>'
      );
    }

  }

  // populate full list of factors (all contributing factors)
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

  // populate what's good info
  function getWhatsGood(userResults) {

    var data = {
        "id": 1558626498
      },
      userResults = userResults;

    $.ajax({
      method: "POST",
      url: "https://us-central1-cyberfortress-sandbox.cloudfunctions.net/rs_contributions",
      contentType: "application/json",
      data: JSON.stringify(data),
    }).done(function(response) {
      console.log('----- Response -----');
      console.log(response);
      populateGood(response, userResults);
    }).fail(function(e) {
      console.log(e)
    });

    function populateGood(response, results) {
      var topNeg = response.top_neg,
        allKeys = Object.keys(topNeg),
        conts = results.top_contributions,
        tags = [],
        relKeys = [];

      var resultsDiv = $('#goodresults-div');

      console.log('----- Results -----');
      console.log(results);
      // console.log('----- Relevent Keys -----');
      // console.log(relKeys);
      console.log('----- top_neg -----');
      console.log(topNeg);

      // make array of tags
      $(conts).each(function() {
        var tag = this.tag;
        if ($.inArray(tag, tags) === -1) {
          tags.push(tag);
        }
      });

      // make array of only keys matching tags
      $(allKeys).each(function() {
        var key = this;
        if ($.inArray(key, tags) !== -1) {
          relKeys.push(key);
        }
      });

      // generate divs only for relevent tags
      $(relKeys).each(function() {
        var key = this,
            icon = getIcon(key);

        $(resultsDiv).append('<div id="' + key + '-row"><p class="bold larger"><i class="' + icon + '"></i> ' + key + '</p></div>');
      });

      // genereate lists per key
      function generateLists() {

        $(relKeys).each(function() { // iterate through relevent keys / tags
          if (topNeg.hasOwnProperty(this)) {
            var arr = topNeg[this],
                key = this;

            console.log(arr);
            $.each( arr, function (i) {
              var num = i + 1;
              $('#' + key + '-row').append(
                '<p><span class="bold">' + num + '</span> '+ arr[i].name + '</p>'
              );

            });
          }
        });
      }
      generateLists();
    }
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
    _domain_id = getURLParameter('id') || localStorage.getItem('_domain_id');
    if (!_domain_id) {
      console.error('Error. Unable to find a _domain_id to share.')
    } else {
      var _sl = document.location.host + document.location.pathname + '?id=' + _domain_id;
      var par = e.target
      var el = document.createElement("textarea");
      el.value = _sl;
      par.appendChild(el);
      el.focus();
      el.select();
      try {
        var ok = document.execCommand("copy");
      } catch (err) {
        console.error(err);
      }
      par.removeChild(el);
    }
  });

  // scroll to full summary btn function
  $('#full-summary').click(function() {
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#summary-div").offset().top
    }, 1000);
  });

})();
