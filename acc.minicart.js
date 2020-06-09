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
ACC.minicart = {

	_autoload: [
		"bindMiniCart"
	],

	ajaxCallback: function() {
	    if (typeof ACC.cart != "undefined" && window.location.pathname.includes("/cart")) {
	        ACC.cart.refreshCartPage();
	    } else {
	        ACC.minicart.refresh;
	    }
	    ACC.minicart.submitTriggered = false;
	},

	refresh: function() {
	    ACC.minicart.refreshMiniCart();
	    ACC.minicart.updateMiniCartDisplay();
	},

	submitTriggered: false,

	bindMiniCart: function(){
        ACC.minicart.refreshMiniCart();

        if($('main > liOffcanvas').length > 0) {
            var __this=$('main > .liOffcanvas');
            __this.clone().appendTo(".navigation-top-innvictus");
        }
    },

	refreshMiniCart: function() {
	    var url = $('.nav-cart .js-mini-cart-link').data("miniCartUrl");

		if(typeof(url) == "undefined"){
			return false;
		}
        
        var containerMiniCart = $('.nav-cart .js-mini-cart-container');
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            success: function(data){
            	containerMiniCart.empty();
              	containerMiniCart.append($(data));
                if (!ACC.minicart.submitTriggered) {
                    ACC.minicart.bindClickUpdateQuantity();
                    ACC.minicart.bindClickRemoveEntry();
                }
            },
            error: function(){
            	console.log('Error load Minicart');
            }
        });

    },

    updateMiniCartDisplay: function(){
    	
        // var cartItems = $(".js-mini-cart-link").data("miniCartItemsText");
        // var miniCartRefreshUrl = $(".js-mini-cart-link").data("miniCartRefreshUrl");
        $.ajax({
            url: "/cart/miniCart/TOTAL",
            cache: false,
            type: 'GET',
            success: function(jsonData){
            	$(".icon-shop-cart.is-navigation__shop-cart-btn span.is-navigation__shop-cart__quantity").text(jsonData.miniCartCount);

            	/* $(".js-mini-cart-link .js-mini-cart-count").data('countitems', jsonData.miniCartCount);
                $(".js-mini-cart-link .js-mini-cart-count").html('<span class="nav-items-total">' + jsonData.miniCartCount + '</span>' );
                $(".js-mini-cart-link .js-mini-cart-price").html(jsonData.miniCartPrice);
                $('.mini-cart-body').find(".mini-cart-totals .value").html(jsonData.miniCartPrice); */

            }
        });
    },
    
    handleKeyEvent: function(elementRef, event) {
        if (event.which == 13 && !ACC.cartitem.submitTriggered) {
            ACC.cartitem.submitTriggered = ACC.minicart.handleUpdateQuantity(elementRef, event);
            return ACC.minicart.submitTriggered;
        } else {
            if (ACC.cartitem.submitTriggered) {
                return false;
            }
        }
        return true;
    },

    handleUpdateQuantity: function(elementRef, event) {
        var form = $(elementRef).closest('form');

        var productCode = form.find('input[name=productCode]').val();
        var initialCartQuantity = form.find('input[name=initialQuantity]');
        var newCartQuantity = form.find('input[name=quantity_' + $(this).data("index") + ']');

	    if (initialCartQuantity.val() != newCartQuantity.val()) {
	        ACC.track.trackUpdateCart(productCode, initialCartQuantity.val(), newCartQuantity.val());
	        initialCartQuantity.val(newCartQuantity.val());
	        ACC.global.ajaxFormSubmit(form, ACC.minicart.ajaxCallback);
	    }
    },

    bindClickUpdateQuantity: function() {
        $('.js-ajax-update-entry-quantity-input').on("keyup", function(e) {
            return ACC.minicart.handleKeyEvent(this, e);
        }).on("keydown", function(e) {
            return ACC.minicart.handleKeyEvent(this, e);
        });
    },

    bindClickRemoveEntry:function(){
    	$("[id^=removeCartEntryButton]").on("click", function(e){
            e.preventDefault();
    		 
	    	var itemIndex = $(this).data("index");
	        var $form = $(this).parent().parent('form');
	        var initialCartQuantity = $form.find('input[name=initialQuantity]');
			var cartQuantity = $form.find('input[name=quantity_'+itemIndex+']');
			cartQuantity.val("0")
			cartQuantity.attr("value","0")
			var cartQuantity2 = $form.find('#quantity_'+itemIndex);
			cartQuantity2.val("0")
			cartQuantity2.attr("value","0")

			var entryNumber = $form.find('input[name=entryNumber]').val();
			var productCode = $form.find('input[name=productCode]').val();

			ACC.global.ajaxFormSubmit($form, ACC.minicart.ajaxCallback);
    	});
    },

};