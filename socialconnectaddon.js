/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2018 SAP SE
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * Hybris ("Confidential Information"). You shall not disclose such
 * Confidential Information and shall use it only in accordance with the
 * terms of the license agreement you entered into with SAP Hybris.
 */

window.fbAsyncInit = function() {
	FB.init({
		appId : '2195305797383528', // Add your fb app ID here
		cookie : true, // enable cookies to allow the server to access
		// the session
		xfbml : true, // parse social plugins on this page
		version : 'v2.8' // use graph api version 2.11
	});
};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id))
		return;
	js = d.createElement(s);
	js.id = id;
	js.src = "https://connect.facebook.net/en_US/all.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function fb_share(title,description, imageUrl, destinationUrl) { 
	// Sharing picture, name, description is deprecated since 17th July. - use meta tags to get images and title etc. 
	// console.log(title + ', '+description+', '+ imageUrl+', '+destinationUrl)
	FB.ui({
		method: 'share',
		href: destinationUrl,
		quote:title,
		}, function(response){
			if (response && !response.error_message) {
				console.log('Posting completed.');
			} else {
				console.log('Error while posting.');
			}
		});
}
