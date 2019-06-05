!function () {
	var script = document.createElement('script');
	script.async = true;
	script.src = 'https://risk.clearbit.com/v1/risk.js';
	var parent = document.getElementsByTagName ('script')[0];
	parent.parentNode.insertBefore (script, parent);
}();

submitIfEmailNotProvider = function (e) {
	tg = e.target;
	if (tg.checkValidity() === false) {
		e.preventDefault ();
		e.stopPropagation ();
		return false;
	} else {
		var bt = tg.getElementsByTagName ('button')[0];
		if (bt) {
			bt.disabled = true;
		}

		var email = tg.email.value;
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
					tg.submit ();
				}

			}).fail (function (e) {
				console.log (e);
			});
		}
	}
};
