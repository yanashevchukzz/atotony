/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

// Version for Innovasport site

var oDoc = document;

ACC.navigation = {

	_autoload: [
		"offcanvasNavigation",
		"myAccountNavigation",
		"ourConceptsNavigation",
		"orderToolsNavigation",
		"searchButtonNavigation",
	],

	offcanvasNavigation: function () {

		enquire.register("screen and (max-width:" + screenSmMax + ")", {

			match: function () {

				$(document).on("click", ".js-enquire-offcanvas-navigation .js-enquire-has-sub .js_nav__link--drill__down", function (e) {
					e.preventDefault();
//                    $(".js-userAccount-Links").hide();
//                    $(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").addClass("active");
//                    $(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");
//                    $(this).parent(".js-enquire-has-sub").addClass("active");
					if ($(this).parent('.nav__links--row').next('.js_sub__navigation').hasClass('isvisible')) {

						$(this).parent('.nav__links--row').next('.js_sub__navigation').removeClass('isvisible');
						$(this).parent('.nav__links--row').next('.js_sub__navigation').hide(500);
						$(this).parent('.nav__links--row').parent('.js-enquire-has-sub').removeClass('active');
						$(this).removeClass("glyphicon-minus");
						$(this).addClass("glyphicon-plus");
					} else {

						$(this).parent('.nav__links--row').next('.js_sub__navigation').addClass('isvisible');
						$(this).parent('.nav__links--row').next('.js_sub__navigation').show(500);
						$(this).parent('.nav__links--row').parent('.js-enquire-has-sub').addClass('active');
						$(this).removeClass("glyphicon-plus");
						$(this).addClass("glyphicon-minus");
					}
				});


				$(document).on("click", ".js-enquire-offcanvas-navigation .js-enquire-sub-close", function (e) {
					e.preventDefault();
//                    $(".js-userAccount-Links").show();
					$(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").removeClass("active");
					$(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");
				});


				$(document).on("click", ".js-enquire-offcanvas-navigation .js-enquire-has-sub .js_sub__navigation .js-open-subsection", function (e) {
					;e.preventDefault();
					var title = '.' + $(this).attr('data-title');

					if ($(this).next('.js-sub-navigation-list').is(':visible')) {
						$(this).next('.js-sub-navigation-list').hide(500);
						$(this).parent('.sub-navigation-section').nextAll(title).children('.sub-navigation-list').hide(500);
						$(this).children('.glyphicon').removeClass("glyphicon-minus");
						$(this).children('.glyphicon').addClass("glyphicon-plus");
					} else {
						$(this).next('.js-sub-navigation-list').show(500);
						$(this).addClass("active");
						$(this).parent('.sub-navigation-section').nextAll(title).children('.sub-navigation-list').show(500);
						$(this).children('.glyphicon').removeClass("glyphicon-plus");
						$(this).children('.glyphicon').addClass("glyphicon-minus");
					}
				});

			},

			unmatch: function () {

				$(".js-userAccount-Links").show();
				$(".js-enquire-offcanvas-navigation ul.js-offcanvas-links").removeClass("active");
				$(".js-enquire-offcanvas-navigation .js-enquire-has-sub").removeClass("active");

				$(document).off("click", ".js-enquire-offcanvas-navigation .js-enquire-has-sub > a");
				$(document).off("click", ".js-enquire-offcanvas-navigation .js-enquire-sub-close");


			}


		});

	},

	myAccountNavigation: function () {

//    	ACC.navigation.ourConceptsNavigation();

		//copy the site logo
		$('.js-mobile-logo').html($('.js-site-logo a').clone());

		//Add the order form img in the navigation
		$('.nav-form').html($('<span class="glyphicon glyphicon-list-alt"></span>'));


		var aAcctData = [];
		var sSignBtn = "";

		//my account items
		var oMyAccountData = $(".accNavComponent");

		//the my Account hook for the desktop
		var oMMainNavDesktop = $(".js-secondaryNavAccount > ul");

		//offcanvas menu for tablet/mobile
		var oMainNav = $(".navigation--bottom > ul.nav__links.nav__links--products");

		if (oMyAccountData) {
			var aLinks = oMyAccountData.find("a");
			for (var i = 0; i < aLinks.length; i++) {
				//console.log(aLinks[i].text+" "+aLinks[i].title);
				aAcctData.push({link: aLinks[i].href, text: aLinks[i].title, title: aLinks[i].text, className: aLinks[i].className});
			}
		}

		var navClose = '';
		navClose += '<div class="close-nav">';
		navClose += '<button type="button" class="js-toggle-sm-navigation btn"><span class="glyphicon glyphicon-remove"></span></button>';
		navClose += '</div>';

//		create Sign In/Sign Out Button
		//var logInGroup = '';
		//if($(".liOffcanvas a") && $(".liOffcanvas a").length > 0){
		//	logInGroup = '<li class=\"auto liUserSign\" ><a class=\"userSign\" onclick="javascript:$(\'.liOffcanvas\').click()"> ' + $(".liOffcanvas a")[0].innerHTML + '</a></li>';
		//}

		//create Welcome User + expand/collapse and close button
		//This is for mobile navigation. Adding html and classes.
		var oUserInfo = $("li.logged_in.js-logged_in");
		//Check to see if user is logged in
		if (oUserInfo && oUserInfo.length === 1) {
			var sUserBtn = '';
			sUserBtn += '<li class=\"auto \">';
			sUserBtn += '<div class=\"userGroup\">';
			sUserBtn += '<span class="glyphicon glyphicon-user myAcctUserIcon"></span>';
			sUserBtn += '<div class=\"userName\">' + oUserInfo[0].innerHTML + '</div>';
			if (aAcctData.length > 0) {
				sUserBtn += '<a class=\"collapsed js-nav-collapse\" id="signedInUserOptionsToggle" data-toggle=\"collapse\"  data-target=\".offcanvasGroup1\">';
				sUserBtn += '<span class="glyphicon glyphicon-chevron-down myAcctExp"></span>';
				sUserBtn += '</a>';
			}
			sUserBtn += '</div>';
			sUserBtn += navClose;

			$('.js-sticky-user-group').html(sUserBtn);


			//$('.js-userAccount-Links').append($('<li class="auto"><div class="myAccountLinksContainer js-myAccountLinksContainer"></div></li>'));


			//FOR DESKTOP
			var myAccountHook = $('<a class=\"myAccountLinksHeader collapsed js-myAccount-toggle\" data-toggle=\"collapse\" data-parent=".yCmsComponent" href=\"#accNavComponentDesktopOne\"><i class="fa fa-user" aria-hidden="true" style="font-size: 1.15em"></i> ' + oMyAccountData.data("title") + ' <i class="fa fa-caret-down" aria-hidden="true"></i></a>');
			myAccountHook.insertBefore(oMyAccountData);


			//FOR MOBILE
			//create a My Account Top link for desktop - in case more components come then more parameters need to be passed from the backend
			//var myAccountHook = [];
			//myAccountHook.push('<div class="sub-nav" style="display: inline-flex;">');
			//myAccountHook.push('<a id="signedInUserAccountToggle" class=\"myAccountLinksHeader collapsed js-myAccount-toggle\" data-toggle=\"collapse\" data-target=".offcanvasGroup2">');
			//myAccountHook.push(oMyAccountData.data("title"));
			//myAccountHook.push('<span class="glyphicon glyphicon-chevron-down myAcctExp"></span>');
			//myAccountHook.push('</a>');
			//myAccountHook.push('</div>');

			//$('.js-myAccountLinksContainer').append(myAccountHook.join(''));

			//add UL element for nested collapsing list
			//$('.js-myAccountLinksContainer').append($('<ul data-trigger="#signedInUserAccountToggle" class="offcanvasGroup2 offcanvasNoBorder collapse js-nav-collapse-body subNavList js-myAccount-root sub-nav"></ul>'));


			//offcanvas items
			//TODO Follow up here to see the output of the account data in the offcanvas menu
			for (var i = 0; i < aAcctData.length; i++) {
				var oLink = oDoc.createElement("a");
				oLink.title = aAcctData[i].title;
				oLink.href = aAcctData[i].link;
				oLink.innerHTML = aAcctData[i].text;
				oLink.className = aAcctData[i].className;

				var oListItem = oDoc.createElement("li");
				oListItem.appendChild(oLink);
				oListItem = $(oListItem);
				oListItem.addClass("auto ");
				$('.js-userAccount-Links').append(oListItem);
			}

		} else {
			var navButtons = (sSignBtn.substring(0, sSignBtn.length - 5) + navClose) + '</li>';
			$('.js-sticky-user-group').html(navButtons);

			if ($('main > .liOffcanvas').length > 0) {
				var __this = $('main > .liOffcanvas ');
				__this.clone().appendTo(".js-login-group");
			}
		}

		// copywrite
		var copywriteYear = $(".sns-copyright").text();
		var myCopywriteHook = [];
		myCopywriteHook.push('<li class="">');
		myCopywriteHook.push('<span class="">' + copywriteYear + '</span>');
		myCopywriteHook.push('</li>');
		$('.js-copywrite-group').append(myCopywriteHook.join(''));

		//desktop
		for (var i = 0; i < aAcctData.length; i++) {
			var oLink = oDoc.createElement("a");
			oLink.title = aAcctData[i].title;
			oLink.href = aAcctData[i].link;
			oLink.innerHTML = aAcctData[i].text;
			oLink.className = aAcctData[i].className;

			var oListItem = oDoc.createElement("li");
			oListItem.appendChild(oLink);
			oListItem = $(oListItem);
//            oListItem.addClass("auto col-xs-12");
			oMMainNavDesktop.get(0).appendChild(oListItem.get(0));
		}

		//hide and show contnet areas for desktop
		$('.js-secondaryNavAccount').on('shown.bs.collapse', function () {

			if ($('.js-secondaryNavOur').hasClass('in')) {
				$('.js-ourConcepts-toggle').click();
			}

		});

		$('.js-secondaryNavOur').on('shown.bs.collapse', function () {

			if ($('.js-secondaryNavAccount').hasClass('in')) {
				$('.js-myAccount-toggle').click();
			}

		});


		$(".myAccountLinksHeader").click(
			function () {
				$('.js-secondaryNavAccount').collapse('toggle');
			}
		);
		$("body").click(
			function () {
				$('.js-secondaryNavAccount').collapse({'toggle': false});
				$('.js-secondaryNavAccount').collapse('hide');
			}
		);
		//change icons for up and down


		$('.js-nav-collapse-body').on('hidden.bs.collapse', function (e) {

			var target = $(e.target);
			var targetSpan = target.attr('data-trigger') + ' > span';
			if (target.hasClass('in')) {
				$(targetSpan).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
			}
			else {
				$(targetSpan).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
			}

		});

		$('.js-nav-collapse-body').on('show.bs.collapse', function (e) {
			var target = $(e.target)
			var targetSpan = target.attr('data-trigger') + ' > span';
			if (target.hasClass('in')) {
				$(targetSpan).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');

			}
			else {
				$(targetSpan).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
			}

		});

		//$('.offcanvasGroup1').collapse();


	},

	orderToolsNavigation: function () {
		$('.js-nav-order-tools').on('click', function (e) {
			$(this).toggleClass('js-nav-order-tools--active');
		});
	},

	ourConceptsNavigation: function () {
		var ourConceptsData = $(".ourNavComponent");

		var ourMainNavDesktop = $(".js-secondaryNavOur > ul");

		var aOurData = [];

		if (ourConceptsData) {
			var aLinks = ourConceptsData.find("a");
			for (var i = 0; i < aLinks.length; i++) {
				aOurData.push({link: aLinks[i].href, text: aLinks[i].title, title: aLinks[i].text});
			}
		}


		for (var i = 0; i < aOurData.length; i++) {
			var oLink = oDoc.createElement("a");
			oLink.title = aOurData[i].title;
			oLink.href = aOurData[i].link;
			oLink.innerHTML = aOurData[i].text;

			var oListItem = oDoc.createElement("li");
			oListItem.appendChild(oLink);
			oListItem = $(oListItem);
			oListItem.addClass("auto col-xs-12");
			ourMainNavDesktop.get(0).appendChild(oListItem.get(0));
		}


		//FOR DESKTOP
		var ourConceptsHook = $('<a class=\"ourConceptsLinksHeader collapsed js-ourConcepts-toggle\" data-toggle=\"collapse\" data-parent=".yCmsComponent" href=\"#ourNavComponentDesktopOne\">' + ourConceptsData.data("title") + ' <i class="fa fa-caret-down" aria-hidden="true"></i></a>');
		ourConceptsHook.insertBefore(ourConceptsData);

		//FOR MOBILE
		//create a My Account Top link for desktop - in case more components come then more parameters need to be passed from the backend
		var ourConceptsHook = [];
		ourConceptsHook.push('<div class="sub-nav">');
		ourConceptsHook.push('<a id="signedInUserAccountToggle" class=\"ourConceptsLinksHeader collapsed js-ourConcepts-toggle\" data-toggle=\"collapse\" data-target=".offcanvasGroup2">');
		ourConceptsHook.push(ourConceptsData.data("title"));
		ourConceptsHook.push('<span class="glyphicon glyphicon-chevron-down myAcctExp"></span>');
		ourConceptsHook.push('</a>');
		ourConceptsHook.push('</div>');
	},
	searchButtonNavigation: function () {

		$(document).on("click", ".mobile-btn-search-js", function (e) {
			e.preventDefault();
			var search = $('.site-search-js');
			if (search.is(':visible')) {
				search.hide(500, function () {
					$(this).removeAttr('style');
				});

			} else {
				search.css({'top': '60px', 'right': '0', 'position': 'absolute', 'max-width': '240px', 'width': '100%'});
				search.show(500);
			}

		});
	}
};
