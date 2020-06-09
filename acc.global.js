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
ACC.global = {

    _autoload: [
        ["passwordStrength", $('.password-strength').length > 0],
        "bindToggleOffcanvas",
        "bindToggleXsSearch",
        "bindHoverIntentMainNavigation",
        "initImager",
        "backToHome",
        "bindRestoreStyle"
    ],
    initHeader:false,

    passwordStrength: function() {
        $('.password-strength').pstrength({
            verdicts: [ACC.pwdStrengthTooShortPwd,
                ACC.pwdStrengthVeryWeak,
                ACC.pwdStrengthWeak,
                ACC.pwdStrengthMedium,
                ACC.pwdStrengthStrong,
                ACC.pwdStrengthVeryStrong
            ],
            minCharText: ACC.pwdStrengthMinCharText
        });
    },

    bindToggleOffcanvas: function() {
        $(document).on("click", ".js-toggle-sm-navigation", function() {
            ACC.global.toggleClassState($("main"), "offcanvas");
            ACC.global.toggleClassState($("html"), "offcanvas");
            ACC.global.toggleClassState($("body"), "offcanvas");
            ACC.global.resetXsSearch();
        });
    },

    bindToggleXsSearch: function() {
        $(document).on("click", ".js-toggle-xs-search", function() {
            ACC.global.toggleClassState($(".site-search"), "active");
            ACC.global.toggleClassState($(".js-mainHeader .navigation--middle"), "search-open");
        });
    },

    resetXsSearch: function() {
        $('.site-search').removeClass('active');
        $(".js-mainHeader .navigation--middle").removeClass("search-open");
    },

    toggleClassState: function($e, c) {
        $e.hasClass(c) ? $e.removeClass(c) : $e.addClass(c);
        return $e.hasClass(c);
    },

    bindHoverIntentMainNavigation: function() {

        enquire.register("screen and (min-width:" + screenSmMin + ")", {

            match: function() {
                // on screens larger or equal screenMdMin (1024px) calculate position for .sub-navigation
                $(".js-enquire-has-sub").hoverIntent(function() {
                    var $this = $(this),
                        itemWidth = $this.width();
                    var $subNav = $this.find('.js_sub__navigation'),
                        subNavWidth = $subNav.outerWidth();
                    var $mainNav = $('.js_navigation--bottom'),
                        mainNavWidth = $mainNav.width();



                    // get the left position for sub-navigation to be centered under each <li>
                    var leftPos = $this.position().left + itemWidth / 2 - subNavWidth / 2;
                    // get the top position for sub-navigation. this is usually the height of the <li> unless there is more than one row of <li>
                    if ($('.js_sub__navigation-innvictus').length > 0) {
                        var topPos = ($this.position().top + $this.height() - 10);
                    } else {
                        var topPos = $this.position().top + $this.height();
                    }



                    if (leftPos > 0 && leftPos + subNavWidth < mainNavWidth) {
                        // .sub-navigation is within bounds of the .main-navigation
                        $subNav.css({
                            "left": leftPos,
                            "top": topPos,
                            "right": "auto"
                        });
                    } else if (leftPos < 0) {
                        // .suv-navigation can't be centered under the <li> because it would exceed the .main-navigation on the left side
                        $subNav.css({
                            "left": 0,
                            "top": topPos,
                            "right": "auto"
                        });
                    } else if (leftPos + subNavWidth > mainNavWidth) {
                        // .suv-navigation can't be centered under the <li> because it would exceed the .main-navigation on the right side
                        $subNav.css({
                            "right": 0,
                            "top": topPos,
                            "left": "auto"
                        });
                    }
                    var ventana_ancho = window.innerWidth;

                    if (ventana_ancho > 992) {
                        $this.addClass("show-sub");
                    }

                }, function() {
                    $(this).removeClass("show-sub")
                });
            },

            unmatch: function() {
                // on screens smaller than screenMdMin (1024px) remove inline styles from .sub-navigation and remove hoverIntent
                $(".js_sub__navigation").removeAttr("style");
                $(".js-enquire-has-sub").hoverIntent(function() {
                    // unbinding hover
                });
            }

        });
    },

    initImager: function(elems) {
        elems = elems || '.js-responsive-image';
        this.imgr = new Imager(elems);
    },

    reprocessImages: function(elems) {
        elems = elems || '.js-responsive-image';
        if (this.imgr == undefined) {
            this.initImager(elems);
        } else {
            this.imgr.checkImagesNeedReplacing($(elems));
        }
    },

    // usage: ACC.global.addGoogleMapsApi("callback function"); // callback function name like "ACC.global.myfunction"
    addGoogleMapsApi: function(callback) {
        if(!ACC.global.initHeader){
            $('head').append('<script class="js-googleMapsApi" type="text/javascript" src="//maps.googleapis.com/maps/api/js?key=' + ACC.config.googleApiKey + '&sensor=false&callback=ACC.storefinder.loadGoogleMap"></script>');
            ACC.global.initHeader = true;
        }
    },

    backToHome: function() {
        $(".backToHome").on("click", function() {
            var sUrl = ACC.config.contextPath;
            window.location = sUrl;
        });
    },

    getCookie: function(name) {
        var name = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return JSON.parse(c.substring(name.length, c.length));
            }
        }
        return "";
    },

    setCookie: function(name, value) {
        var exhours = 3;
        var path = '/';
        var secure = true;
        var d = new Date();

        d.setTime(d.getTime() + exhours * 60 * 60 * 1000);

        var expires = "expires=" + d.toUTCString();
        var secured = secure ? ";secure" : "";

        var valueToStore = JSON.stringify(value);
        document.cookie = "".concat(name, "=").concat(valueToStore, ";").concat(expires, ";path=").concat(path).concat(secured);
    },

    ajaxFormSubmit: function(formElement, callback) {
    	$.ajax({
			url: formElement.attr("action"),
			data: formElement.serialize(),
            type: formElement.prop("method"),
            beforeSend: function () {
    			ACC.colorbox.showLoader();
    		},
    		success: function(data) {
                var html = $(data);
                if($(data).find('header').length) {
                    document.location.reload();
                }
                ACC.colorbox.open("",{
                    html: data,
                    width:"100%",
                    maxWidth:"400px",
                    height: "auto",
                    closeButton: false,
                    scrolling:false,
                    overlayClose:false
                }).resize();
                $("#colorbox,#cboxOverlay").addClass("ajaxResponse");
    		},
            complete: function(response, status) {
            	if(typeof callback == "function") {
            		callback();
            	}
            	ACC.global.switchInterval(true);
            },
            error: function (xht, testStatus, ex) {
                console.log("Failed to get cart content. Error details [" + xht + ", " + textStatus + ", " + ex + "]");
            }
		});
    },

    switchInterval: function(status) {
        if (status == false) {
            clearInterval(ACC.global.interval);
        } else {
            ACC.global.interval = setInterval(function() {
                 ACC.colorbox.close();
             }, 2000);
        }
    },

    interval: null,

    bindRestoreStyle: function() {
        $(document).bind('cbox_closed', function() {
           $("#colorbox,#cboxOverlay").removeClass("ajaxResponse");
        });
    }

};