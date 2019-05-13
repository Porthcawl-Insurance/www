'use strict';

$(function() {

  var div = $('#score-div');

  $(div).ready(function() {

    // scroll to full summary btn function
    $('#full-summary').click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#summary-div").offset().top
      }, 1000);
    });

    $.post("https://us-central1-cyberfortress-www.cloudfunctions.net/demo_risk_score", function(data) {
      console.log(data);

      var summary = data.summary,
        score = data.score,
        email = data.domain,
        rook = $('#rook-svg'),
        color;

      $('#domain').text(email);
      $('#score').html('<span>' + score + '</span> / 10 ');


      fillRook();
      scoreMessage();
      populateCats();

      // //chose color for rook based on score
      function fillRook() {
        switch (true) {
          case (score <= 1.42):
            color = '#cc444b';
            $('.r1').css('fill', color);
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

      function scoreMessage() {

        var input = $('#score-message');

        if(score <= 3.5){
          input.text('Yikes');
        } else if (score <= 7){
          input.text('Not bad');
        } else if (score <= 10){
          input.text('Good job! Thats a great score.')
        }
      }

      function populateCats() {
        // populate summary from json
        $(summary).each(function() {
          var alarm = this.alarm,
          category = this.category,
          description = this.description,
          links = this.links,
          notes = this.notes,
          icon,
          color,
          note;

          // icons for each category
          switch (category) {
            case 'Email and Identity':
              icon = 'fas fa-fingerprint';
              break;
            case 'Hosting Provider':
              icon = 'fas fa-cloud';
              break;
            case 'DNS':
              icon = 'fas fa-globe';
              break;
            case 'Web Servers':
              icon = 'fas fa-server';
              break;
            case 'TLS/SSL':
              icon = 'fas fa-shield-alt';
              break;
            case 'CMS':
              icon = 'fas fa-cog';
              break;
            case 'Footprint':
              icon = 'fas fa-shoe-prints';
              break;
          }

          // icon colors based on alarm
          switch (alarm) {
            case 1:
              color = 'r7';
              break;
            case 0:
              color = 'r4';
              break;
            case -1:
              color = 'r1';
              break;
          }

          $('#cat-div').append(
            "<div class='cat'><p class='icon " +
            color + "'><i class='" +
            icon +"'></i></p><p class='c-title'>" +
            category + "</p><p class='c-text'>" +
            description + "</p></div>");
        });
      }

      function randomNum(){
        score = Math.floor((Math.random() * 10) + 1);
        return;
      }
    });

  });

});
