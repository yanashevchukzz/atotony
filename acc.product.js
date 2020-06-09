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
ACC.product = {

    _autoload: [
        "bindToAddToCartForm",
        "enableStorePickupButton",
        "enableVariantSelectors",
        "bindFacets",
        "addBundle",
        "selectSize"
    ],


    bindFacets: function() {
        // Close sidebar on click button Close
        $(document).on("click", "#slide-submenu", function(e) {

            $(this).closest('.sidebar').fadeOut();
            $('#sidebar-overlay').fadeOut();

        });

        // Close sidebar on click in the overlay
        $(document).on("click", "#sidebar-overlay", function(e) {

            $('.sidebar').fadeOut();
            $('#sidebar-overlay').fadeOut();

        });

        $('.facet-applied > .js-facet-name').click(function() {
            var __this = $(this).parent('.facet-applied');
            var __with = window.outerWidth;
            if (__with < 992) {
                if (__this.children('.facet__name-filter-tiendarayados')) {
                    if (__this.hasClass('open')) {
                        __this.removeClass('open');
                        __this.nextAll('.js-facet').slideUp("slow");
                    } else {
                        __this.addClass('open');
                        __this.nextAll('.js-facet').slideDown("slow");

                    }
                } else {
                    if (__this.hasClass('open')) {
                        __this.removeClass('open');
                        __this.nextAll('.js-facet').fadeOut(500);
                    } else {
                        __this.addClass('open');
                        __this.nextAll('.js-facet').fadeIn(500);

                    }
                }
            }
        })
        $('.div-facet-name-filter-innvictus').children('i').removeClass('fa-caret-down');
        $('.div-facet-name-filter-innvictus').children('i').addClass('fa-plus');
        $('.div-facet-name-filter-tiendarayados').children('i').removeClass('fa-caret-down');
        $('.div-facet-name-filter-tiendarayados').children('i').addClass('fa-plus');

        $('.div-facet-name-filter-innvictus, .div-facet-name-filter-tiendarayados').click(function() {

            if ($(this).children('i').hasClass('fa-plus')) {

                $(this).children('i').removeClass('fa-plus');

                $(this).children('i').addClass('fa-minus');
            } else {

                $(this).children('i').removeClass('fa-minus');

                $(this).children('i').addClass('fa-plus');
            }

        })
        $('.div-facet-name-filter-innovasport').click(function() {

            if ($(this).children('i').hasClass('fa-angle-down') || $(this).children('i').hasClass('fa-caret-down')) {
                $(this).children('i').removeClass('fa-caret-down');
                $(this).children('i').removeClass('fa-angle-down');

                $(this).children('i').addClass('fa-angle-up');
            } else {

                $(this).children('i').removeClass('fa-angle-up');

                $(this).children('i').addClass('fa-angle-down');
            }

        })
        $(document).on("click", ".js-show-facets", function(e) {
            $('.sidebar').fadeIn();
            $('#sidebar-overlay').fadeIn();

            if ($('.js-product-facet').length == 1) {
                var elementClone = $('.js-product-facet').clone();
                elementClone.find('.facet__values').removeClass('facet__values');

                $('.list-group-filter').html(elementClone);
                e.preventDefault();
                var selectRefinementsTitle = $(this).data("selectRefinementsTitle");
            }
            // ACC.colorbox.open(selectRefinementsTitle, {
            // href: ".js-product-facet",
            // inline: true,
            // width: "480px",
            // onComplete: function () {
            // $(document).on("click", ".js-product-facet .js-facet-name",
			// function (e) {
            // e.preventDefault();
            // $(".js-product-facet .js-facet").removeClass("active");
            // $(this).parents(".js-facet").addClass("active");
            // $.colorbox.resize()
            // })
            // },
            // onClosed: function () {
            // $(document).off("click", ".js-product-facet .js-facet-name");
            // }
            // });
        });
        enquire.register("screen and (min-width:" + screenSmMax + ")", function() {
            $("#cboxClose").click();
        });
    },

    selectSize: function(select){
    	var size = $(select).val();
		if(typeof size == "undefined" || size == "empty"){
			$(select).siblings('input[name="agregarButton[]"]').attr('disabled', true).removeClass("btn-add").removeClass("btn-remove");
			return;
		}
		else{
			$(select).siblings('input[name="agregarButton[]"]').attr('disabled', false).addClass("btn-add");
		}
    },

    addBundle: function(){
    	$('input[name="agregarButton[]"]').click(function(){

    		$('#enabledBundle').val(true);

    		if($(this).val() == "Agregar"){
    			$("#error").html("");
    			$(this).siblings('select[name="selectSize[]"]').attr('disabled', true);
	    		var price = parseInt($(this).data('bundle-price'));
	    		$('input[name="agregarButton[]"]').each(function() {
	    			if($(this).val() == "Quitar"){
	    				price += parseInt($(this).data('bundle-price'));
	    			}
	    		});
	    		$('<input>').attr({name:'productBundleCode[]',type:'hidden',value:$(this).siblings('select[name="selectSize[]"]').val()}).appendTo($('#addToCartForm'));
	    		$(this).val($(this).data('value-remove'));
	    		$(this).removeClass("btn-add").addClass("btn-remove");
				$.ajax({
					url: $(this).data('url'),
					data: {
						productBundleCode: $(this).data('code'),
						productBundlePrice: price
						},
					type: "get",
					success: function (response)
					{
						$('#priceWithBundle').html(response.formattedValue);
					}
				});
    		}
    		else{
    			$(this).siblings('select[name="selectSize[]"]').attr('disabled', false);
    			$(this).attr('disabled', true);
    			$('#enabledBundle').val(false);
    			var bundled = $(this).siblings('select[name="selectSize[]"]').val();
        		$('input[name="productBundleCode[]"][value="' + bundled + '"]').remove();
        		var price = 0;
        		$(this).val($(this).data('value-add'));
        		$('input[name="agregarButton[]"]').each(function() {
	    			if($(this).val() != "Agregar"){
	    				price += parseInt($(this).data('bundle-price'));
	    				$('#enabledBundle').val(true);
	    			}
	    		});
        		$(this).siblings('select[name="selectSize[]"]').val("empty");
        		$(this).removeClass("btn-add btn-remove");
        		$.ajax({
					url: $(this).data('url'),
					data: {
						productBundleCode: $(this).data('code'),
						productBundlePrice: price
						},
					type: "get",
					success: function (response)
					{
						$('#priceWithBundle').html(response.formattedValue);
					}
				});
    		}

		});
    },

    onLoadBundle: function(){
    	$('select[name="selectSize[]"]').val("empty");
    	$('select[name="selectSize[]"]').attr('disabled', false);
    	$('input[name="agregarButton[]"]').attr('disabled', true);
		var add = $('input[name="agregarButton[]"]').data('value-add');
		$('input[name="agregarButton[]"]').val(add);
    },

    enableAddToCartButton: function() {
        $('.js-innvictus-addCart-tallas').click(function() {
            var $this = $(this);

            $this.next('.tabla-tallas').addClass('tallas-open');
        });
        $('.js-tiendarayados-addCart-tallas').click(function() {
            var $this = $(this);

            window.location.href = $this.prevAll('input[name="urlproduct"]').val();
        });
        $('.innvictus-gallery-product').mouseleave(function() {
            var $this = $(this);
            $this.find(".tallas-open").removeClass('tallas-open');
        });
        $('.tabla-tallas .tab-pane > a').click(function() {

            var $this = $(this);
            if (!$this.hasClass('disabled')) {
                $('input[name="productCodePost"]').val($this.data("productcode"));

                $('.tallas-open').next('.js-innvictus-addCart').trigger("click");
            }

        });
        // $('.innvictus-gallery-product').hover(
        // function() {
        // var caja= $( this ).children('.clonButtonAddCart');
        // var clonBoton;
        // // if($( this ).children('.addtocart').html()!=undefined){
        // // clonBoton=$( this ).children('.addtocart').html();
        // // $( this ).children('.addtocart').remove()
        // //
        // // }
        //
        //
        // //clonBoton.appendTo(caja)
        // caja.append( clonBoton );
        // caja.show()
        // }, function() {
        // var caja= $( this ).children('.clonButtonAddCart');
        // caja.hide()
        // }
        // );

        $('.js-enable-btn').each(function() {
            if (!($(this).hasClass('outOfStock') || $(this).hasClass('out-of-stock'))) {
                $(this).removeAttr("disabled");
            }
        });
    },

    enableVariantSelectors: function() {
        $('.variant-select').removeAttr("disabled");
    },

    bindToAddToCartForm: function() {
        var addToCartForm = $('.add_to_cart_form');
        addToCartForm.ajaxForm({ success: ACC.product.displayAddToCartPopup });
    },

    bindToAddToCartStorePickUpForm: function() {
        var addToCartStorePickUpForm = $('#colorbox #add_to_cart_storepickup_form');
        addToCartStorePickUpForm.ajaxForm({ success: ACC.product.displayAddToCartPopup });
    },

    enableStorePickupButton: function() {
        $('.js-pickup-in-store-button').removeAttr("disabled");
    },

    displayAddToCartPopup: function(cartResult, statusText, xhr, formElement) {
        $('#addToCartLayer').remove();

        if (typeof ACC.minicart.updateMiniCartDisplay == 'function') {
            ACC.minicart.updateMiniCartDisplay();
        }
        var titleHeader = $('#addToCartTitle').html();

        ACC.colorbox.open(titleHeader, {
            html: cartResult.addToCartLayer,
            width: "460px",
            onComplete: function() {

                setTimeout(function() {

                    ACC.colorbox.resize();
                }, 100);

            },

            onClosed: function() {
                ACC.productDetail.updateCurrentProductInfo();
            }
        });

        var productCode = $('[name=productCodePost]', formElement).val();
        var quantityField = $('[name=qty]', formElement).val();

        var quantity = 1;
        if (quantityField != undefined) {
            quantity = quantityField;
        }

        var cartAnalyticsData = cartResult.cartAnalyticsData;

        var cartData;
        if (cartAnalyticsData) {
            cartData = {
                "cartCode": cartAnalyticsData.cartCode,
                "productCode": productCode,
                "quantity": quantity,
                "productPrice": cartAnalyticsData.productPostPrice,
                "productName": cartAnalyticsData.productName
            };
        }
        ACC.track.trackAddToCart(productCode, quantity, cartData);
    },

    bindDisableAddToCartButton : function() {
    	$("#addToCartButton").click(function (event) {
    		$("#addToCartForm").submit();
    		$(this).prop('disabled', 'disabled');
        });
	},

    bindDisableAddToCartPromotionButton : function() {
    	$("#addToCartButton").click(function (event) {
    		$("#textFieldConfigurationForm").submit();
    		$(this).prop('disabled', 'disabled');
        });
	},

	bindDisableAddToCartGiftCardButton : function() {
		$("#addToCartButton").click(function (event) {
			$("#giftcardConfigurationForm").submit();
			$(this).prop('disabled', 'disabled');
		});
	},

    closeAddToCartPopupAndReloadProduct : function() {
        ACC.colorbox.close();
    }
};

$(document).ready(function() {
    ACC.product.enableAddToCartButton();
    if ($('.js-add-to-cart-innovasport-kiosco')) {

        $('.js-add-to-cart-innovasport-kiosco').attr('type', 'button');
    }
    $('.color-link-selector').click(function() {
        var colorSelected = $(this);
        $('.color-link-selector').removeClass('active');
        colorSelected.addClass('active');
    })
    ACC.product.bindDisableAddToCartButton();
    ACC.product.bindDisableAddToCartPromotionButton();
    ACC.product.bindDisableAddToCartGiftCardButton();
    ACC.product.onLoadBundle();
});