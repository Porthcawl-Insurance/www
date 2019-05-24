'use strict';

$(function() {

  var div = $('#score-div');

  var data = {
    // id: 'f58f0b44-7b20-5fed-b0aa-dc353b89c630', //CyberFortress
    id: 'b1049048-ef36-5d15-85e3-33f1c6dd3518' //Codeup
  }

  $.ajax({
    method: "POST",
    url: "https://us-central1-cyberfortress-sandbox.cloudfunctions.net/rs",
    contentType: "application/json",
    data: JSON.stringify(data),
  }).done(function(response) {
    console.log (response);
    populate(response);
  }).fail(function(e) {
    console.log(e)
  });

  // populate fields with info from json obj
  function populate(result) {

    var domain = result.domain,
      score = result.score,
      date = new Date (result.model.ts*1000),
      conts = result.top_contributions;

    $('#domain').text(domain);
    $('#score').html('<span>' + score + '</span> / 10 ');
    $('#score-message').text('Score as of ' + date.toLocaleDateString());

    fillRook(score);
    topFactors(conts);
    popSummary(conts);
  }

  // color rook based on score
  function fillRook(score) {
    var color;
    switch (true) {
      case (score <= 1.42):
        color = '#cc444b';
        $('.r1').css('fill', color);
        // $('.r1').css({fill: color, transition: "2.0s"});
        break;
      case (score <= 2.83):
        color = '#d8774f';
        $('.r1, .r2').css('fill', color);
        break;
      case (score <= 4.28):
        color = '#de9151';
        $('.r1, .r2, .r3').css('fill', color);
        break;
      case (score <= 5.71):
        color = '#e9b15d';
        $('.r1, .r2, .r3, .r4').css('fill', color);
        break;
      case (score <= 7.14):
        color = '#fff275';
        $('.r1, .r2, .r3, .r4, .r5').css('fill', color);
        break;
      case (score <= 8.57):
        color = '#d3e468';
        $('.r1, .r2, .r3, .r4, .r5, .r6').css('fill', color);
        break;
      case (score <= 10):
        color = '#7ac74f';
        $('.r1, .r2, .r3, .r4, .r5, .r6, .r7').css('fill', color);
        break;
    }
  }

  // get top & bottom factors
  function topFactors(conts) {
    var top = [conts[0], conts[1], conts[2]];
    var bottom = getBottomFactors(conts);

    $(top).each(function() {
      var name = this.name,
        tag = this.tag,
        desc = this.description,
        summary = this.summary,
        icon = getIcon(tag),
        modId;

      $('#top-factors').append(
        '<div class="d-flex flex-row flex-nowrap align-items-center">' +
        '<div class="icon-div"><p class="icon good"><i class="' + icon + '"></i></p></div>' +
        '<div class="text-div">' +
        '<p class="f-name">' + name + '</p>'+
        '<p class="f-desc">' + desc +'</p>' +
        '</div></div>'
      );

      $('#top-div').append(
        '<div class="cat top">' +
        '<p class="c-icon"><i class="' + icon + '"></i></p>' +
        '<p class="c-tag">[ ' + tag + ' ]</p>' +
        '<p class="c-name">' + name + '</p><hr class="dark"/>' +
        '<p class="c-sum">' + desc + '</p>' +
        '</div>'
      );
    });

    $(bottom).each(function (i) {
      var name = this[0].name,
        tag = this[0].tag,
        desc = this[0].description,
        summary = this[0].summary,
        icon = getIcon(tag),
        modId;

      $('#bottom-factors').append(
        '<div class="d-flex flex-row flex-nowrap align-items-center">' +
        '<div class="icon-div"><p class="icon bad"><i class="' + icon + '"></i></p></div>' +
        '<div class="text-div">' +
        '<p class="f-name">' + name + '</p>'+
        '<p class="f-desc">' + desc +'</p>' +
        '</div></div>'
      );
    });

    function getBottomFactors(conts) {
      var clone = conts.slice(0), //clone array as to not change orignal conts[]
          lastConts = [],
          step;

      for (step = 0; step < 3; step++){ // get .last(), then .pop() from clone, 3x
        var lCont = $(clone).last();
        lastConts.push(lCont);
        clone.pop(lCont);
      }

      console.log(lastConts);
      return lastConts;
    }

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
        } else if (summary.indexOf('negative') >= 0){
          color = 'r1';
        }

        $('#cat-info').append(
          "<div class='cat long d-flex flex-row justify-content-between'>" +
          "<div class='icon-div'>" +
          "<p class='icon " + color + "'><i class='" + icon + "'></i></p>" +
          "<p class='c-tag'>" + tag + "</p>" +
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

    if (widgets.length != 0) {
      $('#cat-list').append(
        '<p class="">Widgets</p>' +
        '<p>'
      );
    }
  }

  // return icon class based on tag
  function getIcon(tag) {
    var icon;
    switch (tag) {
      case 'widgets':
        icon = 'fal fa-puzzle-piece';
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
      case 'mod_cms':
        icon = 'fal fa-cog';
        break;
      case 'mod_ns':
        icon = 'fal fa-fingerprint';
        break;
      case 'mod_widgets':
        icon = 'fal fa-puzzle-piece';
        break;
    }
    return icon;
  }

  // scroll to full summary btn function
  $('#full-summary').click(function() {
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#summary-div").offset().top
    }, 1000);
  });


  $('.factor-exp').click(function() {
    console.log('clicked!');
  });




  // $(div).ready(function() {
  //
  //   // data returned from api
  //   $.post("https://us-central1-cyberfortress-www.cloudfunctions.net/demo_risk_score", function(data) {
  //     console.log(data);
  //
  //     var summary = data.summary,
  //       // score = data.score,
  //       score = 1,
  //       email = data.domain,
  //       rook = $('#rook-svg'),
  //       color;
  //
  //     $('#domain').text(email);
  //     $('#score').html('<span>' + score + '</span> / 10 ');
  //
  //
  //     fillRook();
  //     scoreMessage();
  //     populateCats();
  //
  //     // //chose color for rook based on score
  //     // $('#circle').css({fill: "red", transition: "2.0s"});
  //
  //
  //     function fillRook() {
  //       switch (true) {
  //         case (score <= 1.42):
  //           color = '#cc444b';
  //           // $('.r1').css('fill', color);
  //           $('.r1').css({fill: color, transition: "2.0s"});
  //           break;
  //         case (score <= 2.83):
  //           color = '#d8774f';
  //           $('.r1, .r2').css('fill', color);
  //           break;
  //         case (score <= 4.28):
  //           color = '#de9151';
  //           $('.r1, .r2, .r3').css('fill', color);
  //           break;
  //         case (score <= 5.71):
  //           color = '#e9b15d';
  //           $('.r1, .r2, .r3, .r4').css('fill', color);
  //           break;
  //         case (score <= 7.14):
  //           color = '#fff275';
  //           $('.r1, .r2, .r3, .r4, .r5').css('fill', color);
  //           break;
  //         case (score <= 8.57):
  //           color = '#d3e468';
  //           $('.r1, .r2, .r3, .r4, .r5, .r6').css('fill', color);
  //           break;
  //         case (score <= 10):
  //           color = '#7ac74f';
  //           $('.r1, .r2, .r3, .r4, .r5, .r6, .r7').css('fill', color);
  //           break;
  //       }
  //     }
  //
  //     function scoreMessage() {
  //
  //       var input = $('#score-message');
  //
  //       if(score <= 3.5){
  //         input.text('Yikes');
  //       } else if (score <= 7){
  //         input.text('Not bad');
  //       } else if (score <= 10){
  //         input.text('Good job! Thats a great score.')
  //       }
  //     }
  //
  //     function populateCats() {
  //       // populate summary from json
  //       $(summary).each(function() {
  //         var alarm = this.alarm,
  //         category = this.category,
  //         description = this.description,
  //         links = this.links,
  //         notes = this.notes,
  //         icon,
  //         color,
  //         note;
  //
  //         // icons for each category
  //         switch (category) {
  //           case 'Email and Identity':
  //             icon = 'fas fa-fingerprint';
  //             break;
  //           case 'Hosting Provider':
  //             icon = 'fas fa-cloud';
  //             break;
  //           case 'DNS':
  //             icon = 'fas fa-globe';
  //             break;
  //           case 'Web Servers':
  //             icon = 'fas fa-server';
  //             break;
  //           case 'TLS/SSL':
  //             icon = 'fas fa-shield-alt';
  //             break;
  //           case 'CMS':
  //             icon = 'fas fa-cog';
  //             break;
  //           case 'Footprint':
  //             icon = 'fas fa-shoe-prints';
  //             break;
  //         }
  //
  //         // icon colors based on alarm
  //         switch (alarm) {
  //           case 1:
  //             color = 'r7';
  //             break;
  //           case 0:
  //             color = 'r4';
  //             break;
  //           case -1:
  //             color = 'r1';
  //             break;
  //         }
  //
  //         $('#cat-div').append(
  //           "<div class='cat'><p class='icon " +
  //           color + "'><i class='" +
  //           icon +"'></i></p><p class='c-title'>" +
  //           category + "</p><p class='c-text'>" +
  //           description + "</p></div>");
  //       });
  //     }
  //
  //     function randomNum(){
  //       score = Math.floor((Math.random() * 10) + 1);
  //       return;
  //     }
  //   });
  //
  // });
  //
  // var data = {
  //   id : "f58f0b44-7b20-5fed-b0aa-dc353b89c630"
  // };



});
