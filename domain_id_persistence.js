/*
Retrieve a specific URL parameter.

*/

getURLParameter = function (sParam) {
    var sPageURL = window.location.search.substring (1);
    var sURLVariables = sPageURL.split ('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split ('=');
        if (sParameterName[0] == sParam) {
            console.log (sParameterName[1]);
            // return sParameterName[1];
        }
    }
};

/*
Attempt to read the "id" parameter. If it is available, update Local Storage and call the API function to populate the RS data.

If not, attempt to read from Local Storage.

If still unavailable, present the user with an error.
*/

_domain_id = getURLParameter ('id')
if (_domain_id) {
  // Call API function to populate RS data with id = _domain_id
  localStorage.setItem ('_domain_id', nsId)
} else {
  var _domain_id = localStorage.getItem ('_domain_id')
  if (_domain_id) {
    // TODO: Call API function to populate RS data with id = _domain_id
    ;
  } else {
    // TODO: Display an error stating that no RS data is available ... Same error as when the API call returns a 404.
    ;
  }
}
