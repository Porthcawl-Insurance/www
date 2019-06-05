!function () {
	var script = document.createElement('script');
	script.async = true;
	script.src = 'https://risk.clearbit.com/v1/risk.js';
	var parent = document.getElementsByTagName ('script')[0];
	parent.parentNode.insertBefore (script, parent);
}();

submitIfEmailNotProvider = function (e) {
  e.preventDefault ();
	var button = e.target.getElementsByTagName ('button')[0];
	if (button) {
		button.disabled = true;
	}

	var email = e.target.email.value;
	if (!email) {
		return false;
	} else {
		$.ajax ({
			method: "POST",
			url: "https://us-central1-cyberfortress-sandbox.cloudfunctions.net/is_email_provider",
			contentType: "application/json",
			data: JSON.stringify ({"email": email}),

		}).done (function (resp) {
			if (resp.hasOwnProperty ('is_email_provider') && !resp['is_email_provider']) {
				e.target.submit ();
			}

		}).fail (function (e) {
			console.log (e);
		});
	}
};
