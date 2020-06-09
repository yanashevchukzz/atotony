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
ACC.cartitem = {

	_autoload : [ "bindCartItem", "bindCartItemsQtyChange" ],

	submitTriggered : false,

	ajaxCallback: function() {
	    if (typeof ACC.cart != "undefined") {
	        ACC.cart.refreshCartPage();
	    }
	    ACC.cartitem.submitTriggered = false;
	},

	bindCartItem : function() {
		$(document).on("click", ".js-remove-entry-button", function() {
            var entryNumber = $(this).attr('id').split("_")[1];
            var form = $('#updateCartForm' + entryNumber);

            var productCode = form.find('input[name=productCode]').val();
            var initialCartQuantity = form.find('input[name=initialQuantity]');
            var cartQuantity = form.find('input[name=quantity]');

            ACC.track.trackRemoveFromCart(productCode, initialCartQuantity.val());

            cartQuantity.val(0);

            ACC.global.ajaxFormSubmit(form, ACC.cartitem.ajaxCallback);
		});
		$(document).on("keyup", ".js-update-entry-quantity-input", function(e) {
			return ACC.cartitem.handleKeyEvent(this, e);
		});
		$(document).on("keydown", ".js-update-entry-quantity-input", function(e) {
			return ACC.cartitem.handleKeyEvent(this, e);
		});

		$(document).on("click", "form[id^=moveForm] a", function() {
		    ACC.global.ajaxFormSubmit($(this).parent('form'), ACC.cartitem.ajaxCallback);
		    return false;
		});
		$(document).on("click", "form[id^=saveForm] a", function() {
		    ACC.global.ajaxFormSubmit($(this).parent('form'), ACC.cartitem.ajaxCallback);
		    return false;
		});
	},

	handleKeyEvent : function(elementRef, event) {
		if (event.which == 13 && !ACC.cartitem.submitTriggered) {
			
			ACC.cartitem.submitTriggered = ACC.cartitem.handleUpdateQuantity(
					elementRef, event);
			return false;
		} else {
			
			// Ignore all key events once submit was triggered
			if (ACC.cartitem.submitTriggered) {
				return false;
			}
		}

		return true;
	},

	handleUpdateQuantity : function(elementRef, event) {
		var form = $(elementRef).closest('form');

		var productCode = form.find('input[name=productCode]').val();
		var initialCartQuantity = form.find('input[name=initialQuantity]')
				.val();
		var newCartQuantity = form.find('input[name=quantity]').val();
		
		if (initialCartQuantity != newCartQuantity) {
			ACC.track.trackUpdateCart(productCode, initialCartQuantity,
					newCartQuantity);
			ACC.global.ajaxFormSubmit(form, ACC.cartitem.ajaxCallback);
		}

	},

	bindCartItemsQtyChange : function(e) {
	    $(document).on("click", ".js-qty-change", function(event) {
	    	var button = $(this);
			var input;

    	    // choose beteen substract or add
	        if (button.attr('id').includes('minus')) {
	            input = $(this).nextAll('input');
                if (!isNaN(input.val()) && input.val() > 1) {
	                input.val(parseInt(input.val()) - 1);
	                ACC.cartitem.handleUpdateQuantity(this, e);
    	        }
	    	} else if (button.attr('id').includes('plus_')) {
	    	    input = $(this).prev('input');
		        if (!isNaN(input.val())) {
			        input.val(parseInt(input.val()) + 1);
			        ACC.cartitem.handleUpdateQuantity(this, e);
    		    }
	    	}
	    	return false;
   		});
	},

	loadBalance : function(e) {
	    var selectUrl = ACC.config.encodedContextPath + '/loadBalance';
	    var mssg = $("#loadingMens").text();
	    var amountValue = $("input[id=availableBalance]").val(mssg);
	    cardNumber = $("#card_number").val();
	    pin = $("#giftcardPin").val();
	    amountValue.show();

	    $.ajax({
	        url: selectUrl,
	        data: {
	            cardNumber : cardNumber,
	            pin: pin
	        },
	        type: "GET",
	        success: function(data) {
	            if (data.error) {
	                var status = $("#errorStatus").data("estatus");
	                $("#errorStatus").text(status);
	                amountValue.val("Invalid");
	                $("#canjear").attr('disabled', true);
	                $("#giftcardAmount").val("");
	                $("#giftcardAmount").attr('disabled', true);
	            } else {
	                $("#availableBalance").val(data.availableBalance);
	                $("#giftcardAmount").val(data.suggestedAmount);
	                $("#canjear").attr('disabled', false);
	                $("#errorStatus").text("");
	                amountValue.hide();
	            }
	        },
            error: function (xht, textStatus, ex) {
                console.log("Failed request. Error details [" + xht + ", " + textStatus + ", " + ex + "]")
            },
	    });
	}
};
