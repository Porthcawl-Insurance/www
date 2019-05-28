'use strict';

$(function() {

  var emailInput = $('#user-email');

  // -------------------------------------------------------//
  // Sending Risk Score Email ------------------------------//
  // -------------------------------------------------------//

  var sendMessage = function(email) {

    var domain = email.substring(email.indexOf("@") + 1);

    if (domain.indexOf('gmail') >= 0) { // if invalid email

      // $('#invalid').modal('show');
      window.location.replace("/invalid/");

    } else { // if valid email

      $.ajax({
        type: 'POST',
        url: 'https://mandrillapp.com/api/1.0/messages/send-template.json',
        data: {
          'key': 'texJ0d69RJ75NZSV-OJYOg', // removed for git push
          'template_name': 'score-email',
          'template_content': [{
            'name': 'score-email',
            'content': 'score-email'
          }],
          'message': {
            'from_email': 'info@cyberfortress.com',
            'to': [{
              'email': email,
              'type': 'to'
            }],
            'subject': 'Your Downtime Risk from CyberFortress',
            'merge': true,
            'merge_language': 'mailchimp',
            'global_merge_vars': [{
              'name': 'domain',
              'content': domain
            }],
            'merge_vars': [{
              'rcpt': email,
              'vars': [{
                  'name': 'email',
                  'content': email,
                },
                {
                  'name': 'redirect_link',
                  'content': 'https://cyberfortress-www-sandbox.appspot.com/score/'
                },
              ],
            }],
          }
        }
      }).done(function(response) {
        console.log(response);
        window.location.replace("/thanks/");
      });

      function parseQuery(queryString) {
        var query = {};
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
      } //end of parseQuery();
    }
  } // end of sendMessage();

  // -------------------------------------------------------//
  // Email Submit Btn --------------------------------------//
  // -------------------------------------------------------//

  // $('#email-submit').click(function(e) {
  //   e.preventDefault();
  //
  //   var fieldValue = $(emailInput).val();
  //
  //   // $(this).validate();
  //
  //   sendMessage(fieldValue);
  // });

  // -------------------------------------------------------//
  // Email Resend Btn --------------------------------------//
  // -------------------------------------------------------//

  $('#email-resend').click(function(e) {
    e.preventDefault();
    var fieldValue = $(emailInput).val();
    sendMessage(fieldValue);
  });

  // -------------------------------------------------------//
  // Modals ------------------------------------------------//
  // -------------------------------------------------------//

  $("#invalid").on("hidden.bs.modal", function() {
    $(emailInput).focus().val('');
  });

});
