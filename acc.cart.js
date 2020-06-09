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
ACC.cart = {

    _autoload: [
        "bindApplyVoucher",
        "bindToReleaseVoucher",
        "bindSavedProduct",
        "bindGiftCardDelete"
    ],

    refreshCartPage: function() {
        // update cart page
        $.ajax({
            url: "cart/content",
            type: "GET",
            success: function(data) {
                $('main .content-page').html(data);
            },
            error: function (xht, textStatus, ex) {
                console.log("Failed request. Error details [" + xht + ", " + textStatus + ", " + ex + "]")
            },
        });
        if (typeof ACC.minicart != "undefined") {
            ACC.minicart.refresh();
        }
    },

    refreshCartTotals: function () {
        $.ajax({
            url: "cart/totals",
            type: "GET",
            success: function(data) {
                $('main .content-page .cartBottom').parent().html(data);
                $('main .content-page .row.js-cart-totals').html($(data).find('.cart-totals').html());
            },
            error: function (xht, textStatus, ex) {
               console.log("Failed request. Error details [" + xht + ", " + textStatus + ", " + ex + "]")
            },
        });

        // refresh minicart
        if (typeof ACC.minicart != "undefined") {
            ACC.minicart.refresh();
        }
    },

    bindApplyVoucher: function () {
        $(document).on("click", "#js-voucher-apply-btn", function(e) {
            ACC.cart.handleApplyVoucher(e);
        });

        $(document).on("keypress", "#js-voucher-code-text", function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                ACC.cart.handleApplyVoucher(e);
                return false;
            }
        });
    },

    handleApplyVoucher: function (e) {
        var voucherCode = $.trim($("#js-voucher-code-text").val());
        if (voucherCode != '' && voucherCode.length > 0) {
            ACC.global.ajaxFormSubmit($('#applyVoucherForm'), ACC.cart.refreshCartPage);
        }
    },

    bindToReleaseVoucher: function () {
        $(document).on("click", ".js-release-voucher-remove-btn", function(event) {
            ACC.global.ajaxFormSubmit($(this).closest('form'), ACC.cart.refreshCartPage);
        });
    },

    bindSavedProduct: function() {
        $(document).on("click", "form[id^='moveCartForm'] a", function() {
            ACC.global.ajaxFormSubmit($(this).parent('form'), ACC.cart.refreshCartPage);
            return false;
        });
        $(document).on("click", "form[id^='removeSaveForm'] button[id^='removeEntry']", function() {
            ACC.global.ajaxFormSubmit($(this).parent('form'), ACC.cart.refreshCartPage);
            return false;
        });
    },

    useGiftCard: function() {
        if ($('#card_number').val() == '') {
            var tarjeta = $('#errorTarjeta').data("tarjeta");
            $('#errorTarjeta').text(tarjeta);
            $('#card_number').removeClass("formControl");
            $('#card_number').addClass("formControlError");
        } else {
            $('#errorTarjeta').text("");
        }
        if ($('#giftcardPin').val() == '') {
            var pin = $('#errorPin').data("pin")
            $('#errorPin').text(pin);
            $('#giftcardPin').removeClass("formControl");
            $('#giftcardPin').addClass("formControlError");
        } else {
            $('#errorPin').text("");
        }
        if ($('#giftcardAmount').val() == '') {
            var amount = $('#errorAmount').data("amount");
            $('#errorAmount').text(amount);
            $('#giftcardAmount').removeClass("formControl");
            $('#giftcardAmount').addClass("formControlError");
        } else {
            $('#errorAmount').text("");
        }

        if ($('#card_number').val() != '' && $('#giftcardPin').val() != ''
                && $('#giftcardAmount').val() != '') {
            $("#canjear").attr('disabled', false);
            if(typeof ACC.global.ajaxFormSubmit != "undefined") {
                ACC.global.ajaxFormSubmit($("#useGiftCardForm"), ACC.cart.refreshCartTotals);
            } else {
                $("#useGiftCardForm").submit();
            }
        }

    },

    bindGiftCardDelete: function() {
        $(document).on("submit", "form[id^=useGiftCardForm-]", function() {
            if(typeof ACC.global.ajaxFormSubmit != "undefined") {
                ACC.global.ajaxFormSubmit($(this), ACC.cart.refreshCartTotals);
                return false;
            } else {
                return true;
            }
        });
    }

};