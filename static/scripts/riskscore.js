'use strict';

$(function() {

  var div = $('#score-div');

  $(div).ready(function() {


    $.post("https://us-central1-cyberfortress-www.cloudfunctions.net/demo_risk_score", function(data) {
      console.log(data);

      var summary = data.summary,
        score = data.score,
        email = data.domain,
        color;

      $('#domain-name').text(email);
      $('#score').text(score + ' / 10 ');
      fillRook();

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
      
    });

  });

});
