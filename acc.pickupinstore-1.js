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
ACC.pickupinstore = {

		_autoload: [
			"initGoogleMap",
			"bindRecogeEnTienda",
			"bindUseCurrentLocation",
			"bindSearchResults",
			"bindSearchResultListeners",
			"bindFindOnlyInStock",
			"bindPickupInstorePopup"
			],

			initGoogleMap: function() {
				ACC.global.addGoogleMapsApi("ACC.pickupinstore.drawMap");
			},

			bindRecogeEnTienda : function(){
				$("#js-pdp-store-finder").find(".is-sf__content__search__cta").click(function(ev) {
					var storeFinder = ACC.pickupinstore.getStoreFinder();

					ev.preventDefault();					
					var location = $("#is-sf__content__search__input").val();

					if(location.length > 0){
						if (storeFinder) {
							storeFinder.showPreloader();
						}

						var url = $("#js-location-service").val();
						ACC.pickupinstore.locationSearchSubmit(location,"false",0,url);
					}else{
						if(!$("#js-pdp-store-finder").find(".is-sf__content__search__error").hasClass("show")){
							$("#js-pdp-store-finder").find(".is-sf__content__search__error").addClass("show")
						}
					}
				});

				$("#is-sf__content__search__input").keyup(function(ev) {
					var storeFinder = ACC.pickupinstore.getStoreFinder();

					ev.preventDefault();

					if (ev.key != undefined && ev.key == "Enter"){
						var location = $(this).val();
						if(location.length > 0){
							var url = $("#js-location-service").val();
							ACC.pickupinstore.locationSearchSubmit(location,"false",0,url);
						}else{
							if(!$("#js-pdp-store-finder").find(".is-sf__content__search__error").hasClass("show")){
								$("#js-pdp-store-finder").find(".is-sf__content__search__error").addClass("show")
							}
						}
					}
				});
			},

			bindUseCurrentLocation : function(){
				$("#js-use-my-location-btn a").click(function(ev){
					ev.preventDefault();
					var storeFinder = ACC.pickupinstore.getStoreFinder();
					if (!storeFinder) {
						return;
					}

                    if(typeof ACC.geolocation != "undefined") {
                        ACC.geolocation.checkGeolocation(ACC.pickupinstore.searchByGeolocation);
                    } else {
    					if (navigator.geolocation) {
	    					navigator.geolocation.getCurrentPosition(
		    				function (position) {
			    				if (position && position.coords) {
				    				var latitude = position.coords.latitude;
					    			var longitude = position.coords.longitude;
					    			ACC.pickupinstore.searchByGeolocation(latitude, longitude);
    							}
	    					},
		    				function showError(error) {
			    				  switch(error.code) {
				    			    case error.PERMISSION_DENIED || error.POSITION_UNAVAILABLE || error.TIMEOUT || error.UNKNOWN_ERROR:
					    				if (storeFinder) {
						    				storeFinder.hidePreloader();
							    		}
								    	$("#js-pdp-store-finder").find(".is-sf__error").addClass("show");
									    //$("#js-pdp-store-finder").find(".is-sf__fail-error").removeClass("hide");
    									$("#js-pdp-store-finder").find(".is-sf__error__msg.is-sf__no-results-error").addClass("show");
	    								$("#js-pdp-store-finder").find(".is-sf__error__msg.is-sf__no-results-error").removeClass("hide");
 		    					        break;
			    				  }
				    			}

						    );
    					}
    			    }
				});
			},

			searchByGeolocation : function(latitude, longitude) {
			    if(latitude == null && longitude == null && typeof ACC.geolocation.coords == "undefined")
			        return false;
			    latitude = (typeof latitude == "undefined") ? ACC.geolocation.coords.latitude : latitude;
			    longitude = (typeof longitude == "undefined") ? ACC.geolocation.coords.longitude : longitude;
			    var url = $('#js-location-service').val();
			    ACC.pickupinstore.getStoreFinder().showPreloader();
			    ACC.pickupinstore.locationSearchSubmit("", "false", 0, url, latitude, longitude);
			},

			bindFindOnlyInStock : function(){
				$("#is-sf__inStockStores").change( function(ev){
					ev.preventDefault();

					if($(".is-sf__boxes-wrapper .is-sf__buy-store").hasClass("show")){
						$(".is-sf__boxes-wrapper .is-sf__buy-store").removeClass("show");
					}
					if($(".is-sf__boxes-wrapper .is-sf__reserve").hasClass("show")){
						$(".is-sf__boxes-wrapper .is-sf__reserve").removeClass("show");
					}

					if($(this).is(":checked")){
						$(".is-sf__result-header-relevant .resultStock").each(function() {
							var stockLevel = parseInt($(this).html());
							var qty = parseInt($("#selected-cantidad").text());
							if(isNaN(stockLevel) || stockLevel < qty || stockLevel <= 0){
								var row = $(this).parents("li:first");
								$(row).addClass("hide");
							}
						});

					}else{
						$(".is-sf__result-header-relevant .resultStock").each(function() {
							var row = $(this).parents("li:first");
							if($(row).hasClass("hide")){
								$(row).removeClass("hide");
							}							
						});
					}

					ACC.pickupinstore.selectFirstStore();
				});
			},

			bindSearchResults : function(){				
				var addToCartStorePickUpForm = $("#is-add_to_cart_form");
				addToCartStorePickUpForm.ajaxForm({ success: ACC.product.displayAddToCartPopup });
			},

			bindSearchResultListeners: function(){
				$(document).on("click", ".is-sf__result-content", function(e) {
					e.preventDefault();
					$(this).toggleClass("toggled");
					$(this).find(".is-sf__result-header").toggleClass("toggled");

				});

				$(document).on("click", "[id^=selectedStore]", function(e) {		
					var url = $("#js-location-service-select-pos").val();
					var parent = $(this).parent();
					var posName = parent.data("store");	

					while(posName == undefined || posName == ""){
						parent = parent.parent();
						posName = parent.data("store");
					}

					var qty = parseInt($("#selected-cantidad").text());
					if(isNaN(qty)){
						qty = 1;
					}

					$("#is-add_to_cart_form").find(".hiddenStoreNamePost").val(posName);
					$("#is-add_to_cart_form").find(".hiddenShipToStoreQty").val(qty);

					//check for ship to store or buy at store
					$.ajax({
						url: url,
						timeout: 600000,
						data: {
							posName:posName,
							qty:qty
						},
						type: "post",
						success: function(data, textStatus, request) {
							var shipToStore = JSON.parse(request.getResponseHeader("shipToStore"));
							var buyAtStore = JSON.parse(request.getResponseHeader("buyAtStore"));

							var responseBody = $.parseJSON(data);
							if(responseBody != undefined && ! $.isEmptyObject(responseBody)){
								ACC.pickupinstore.setPosInfo(responseBody);
							}

							if(shipToStore == true){
								$("#is-sf__buy-store__sts").addClass("show");
							}else if($("#is-sf__buy-store__sts").hasClass("show")){
								$("#is-sf__buy-store__sts").removeClass("show");
							}
							if(buyAtStore == true){
								$("#is-sf__buy-store__bas").addClass("show");
							}else if($("#is-sf__buy-store__bas").hasClass("show")){
								$("#is-sf__buy-store__bas").removeClass("show");
							}
							console.log("[ship to store: "+shipToStore+"]\n[buy at store: "+buyAtStore+"]");
						},
						error: function () {
							console.log("internal error occur");
						}
					});

					$("#js-pdp-store-finder").find(".is-sf__cta-sn").addClass("show");
				});

			},

			bindPickupInstorePopup : function(){
				$(".is-sf__buy-store__link, #is-sf__buy-store__bas").click(function(ev) {
					$(".js__buy-in-store").each(function() {
						if($(this).hasClass("hide")){
							$(this).removeClass("hide")
						}
					});

					$(".js__ship-to-store").each(function() {
						if(!$(this).hasClass("hide")){
							$(this).addClass("hide")
						}
					});

					if($("#selected-cantidad") != undefined){
						var qty = parseInt($("#selected-cantidad").text());
						var html = "<strong>"+qty+"</strong>";
						$(".is-buyInStore__header__summary__quantity .is-quantity-span__tag").html(html);
					}

					ISF.app.getComponent(document.querySelector('.is-modal.buyInStore')).open();
				});

				$(".is-sf__reserve__link, #is-sf__buy-store__sts").click(function(ev) {
					$(".js__buy-in-store").each(function() {
						if(!$(this).hasClass("hide")){
							$(this).addClass("hide")
						}
					});
					$(".js__ship-to-store").each(function() {
						if($(this).hasClass("hide")){
							$(this).removeClass("hide")
						}
					});

					if($("#selected-cantidad") != undefined){
						var qty = parseInt($("#selected-cantidad").text());
						var html = "<spring:theme code='rga.modal.quantity'/>&nbsp;<strong>"+qty+"</strong>";
						$(".is-buyInStore__header__summary__quantity").html(html);
					}

					ISF.app.getComponent(document.querySelector('.is-modal.buyInStore')).open();

				});	

				$(".is-buyInStore__main__store-info__cta.js__ship-to-store").click(function(ev) {	
					ev.preventDefault();
					ISF.app
					.getComponent(document.querySelector(".is-modal.buyInStore"))
					.close();
					$('#is-add_to_cart_form').submit();
				});

				$(".is-buyInStore__main__store-info__cta.js__buy-in-store").click(function(ev) {
					var long = $(this).data("longitude");
					var lat = $(this).data("latitude");
					if(long == undefined || lat == undefined || long =='' || lat==''){
						return;
					}

					window.open("https://www.google.com/maps/search/?api=1&query="+lat+","+long, "_blank");
				});
			},

			getStoreFinder: function() {
				// check for pdp store finder
				var pdpStoreFinder = ISF.app.getComponent(document.querySelector(".is-pdpStoreFinder"));
				var storeFinder;

				if (pdpStoreFinder) {
					storeFinder = pdpStoreFinder.sf;

					// in else put store finder for plp when implemented
				} else {
				}

				return storeFinder;
			},

			locationSearchSubmit: function(location, cartPage, entryNumber,
					url, latitude, longitude) {

				ACC.pickupinstore.beforeLocationSearchSubmit();

				// use geocoding via Javascript API
				if (location !== undefined && location !== "") {

					// add mexico search term
					if (location.indexOf("mexico") == -1) {
						location += " mexico";
					}

					//console.log("start geocoding with js API");
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({ 'address': location }, function(results, status) {
						var storeFinder = ACC.pickupinstore.getStoreFinder();

						if (status == 'OK') {

							// set latitude/longitude
							latitude = results[0].geometry.location.lat();
							longitude = results[0].geometry.location.lng();

							// sblank location
							location = "";

							$.ajax({
								url: url,
								timeout: 600000,
								data: {
									locationQuery: location,
									cartPage: cartPage,
									entryNumber: entryNumber,
									latitude: latitude,
									longitude: longitude
								},
								type: "post",
								success: function(response) {
									var storeFinder = ACC.pickupinstore.getStoreFinder();

									if (storeFinder) {
										storeFinder.hidePreloader();
									}

									ACC.pickupinstore.refreshPickupInStoreColumn(response);
								},
								error: function () {
									var storeFinder = ACC.pickupinstore.getStoreFinder();

									if (storeFinder) {
										storeFinder.hidePreloader();
									}

									$("#js-pdp-store-finder").find(".is-sf__error").addClass("show");
									$("#js-pdp-store-finder").find(".is-sf__fail-error").removeClass("hide");
								}
							});


						} else {
							if (storeFinder) {
								storeFinder.hidePreloader();
							}

							$("#js-pdp-store-finder").find(".is-sf__error").addClass("show");
							$("#js-pdp-store-finder").find(".is-sf__fail-error").removeClass("hide");
							console.log('Geocode was not successful for the following reason: ' + status);
						}
					});

				} else {

					$.ajax({
						url: url,
						timeout: 600000,
						data: {
							locationQuery: location,
							cartPage: cartPage,
							entryNumber: entryNumber,
							latitude: latitude,
							longitude: longitude
						},
						type: "post",
						success: function(response) {
							var storeFinder = ACC.pickupinstore.getStoreFinder();

							if (storeFinder) {
								storeFinder.hidePreloader();
							}

							ACC.pickupinstore.refreshPickupInStoreColumn(response);
						},
						error: function () {
							var storeFinder = ACC.pickupinstore.getStoreFinder();

							if (storeFinder) {
								storeFinder.hidePreloader();
							}

							$("#js-pdp-store-finder").find(".is-sf__error").addClass("show");
							$("#js-pdp-store-finder").find(".is-sf__fail-error").removeClass("hide");
						}
					});

				}

			},

			beforeLocationSearchSubmit: function(){
				//hide error msg
				if($("#js-pdp-store-finder").find(".is-sf__error").hasClass('show')){
					$("#js-pdp-store-finder").find(".is-sf__error").removeClass("show");
					if($("#js-pdp-store-finder").find(".is-sf__fail-error").hasClass("hide")){
						$("#js-pdp-store-finder").find(".is-sf__fail-error").addClass("hide");
					}else{
						$("#js-pdp-store-finder").find(".is-sf__no-results-error").addClass("hide");
					}
				}


				if($("#js-pdp-store-finder").find(".is-sf__content__search__error").hasClass("show")){
					$("#js-pdp-store-finder").find(".is-sf__content__search__error").removeClass("show")
				}

				//hide mock containers
				$("#is-sf__buy-store__sts").removeClass("show");
				$("#is-sf__buy-store__bas").removeClass("show");
				$("is-sf__cta-sn hide-it").removeClass("show");

				$("#js-pdp-store-finder").find(".is-sf__result").empty();

			},

			refreshPickupInStoreColumn: function(data) {
				data = $.parseJSON(data);
				if(data && data.data && data.data.length > 0){
					var listitems = "";

					for (i = 0; i < data["data"].length; i++) {
						listitems += ACC.pickupinstore.createListItemHtml(data["data"][i],i);
					}

					$("#js-pdp-store-finder").find(".is-sf__results").html(listitems);					
					$("#js-pdp-store-finder").find(".is-sf__content__results").addClass('show');

					if($("#is-sf__inStockStores").is(":checked")){
						$("#is-sf__inStockStores").change();
					}
					ACC.pickupinstore.selectFirstStore();
				}else{
					$("#js-pdp-store-finder").find(".is-sf__error").addClass("show");
					$("#js-pdp-store-finder").find(".is-sf__no-results-error").removeClass("hide");
				}

			},

			createListItemHtml: function(data, id) {

				var item = "";
				item += '<li class="is-sf__result" data-store="' + data.name + '">';
				item += '<label for="selectedStore' + id + '">';
				item += '<input type="radio" id="selectedStore' + id + '" name="selectedStore">';
				item += '<span class="overlay">&nbsp;</span>';
				item += '</label>';
				item += '<div class="is-sf__result-content">';
				item += '<div class="is-sf__result-header">';
				item += '<p class="icon-arrow"><span>' + data.displayName + '</span>';
				item += '<span>' + data.formattedDistance + '</span></p>';
				item += '<div class="is-sf__result-header-relevant">' + data.stockPickup + '</div>';
				item += '</div>';
				item +='<div class="is-sf__result-body">';
				item +='<p>' + data.line1 + '</p>';
				item +='<p>' + data.town + '. ' + data.country + '</p>';
				item +='<p>' + data.phone + '</p>';
				item +='</div>';
				item +='</div>';
				item +='</li>';

				return item;
			},

			setPosInfo: function(data){
				if($(".buyInStore.is-modal") != undefined){
					$(".buyInStore.is-modal .is-buyInStore__main__store-info__title-name").html(data.name);
					$(".buyInStore.is-modal .is-buyInStore__main__store-info__address").html(data.address);
					$(".buyInStore.is-modal .is-buyInStore__main__store-info__schedule").html(data.openings);

					$(".buyInStore.is-modal .is-buyInStore__main__store-info__cta.js__buy-in-store").attr("data-longitude",data.longitude);
					$(".buyInStore.is-modal .is-buyInStore__main__store-info__cta.js__buy-in-store").attr("data-latitude",data.latitude);
				}
			},

			validatePickupinStoreCartEntires: function() {
				var validationErrors = false;
				$("form.cartEntryShippingModeForm").each(
						function() {
							var formid = "#" + $(this).attr('id');
							if ($(formid + ' input[value=pickUp][checked]').length &&
									ACC.pickupinstore
									.checkIfPointOfServiceIsEmpty($(this))) {
								$(this).addClass("shipError");
								validationErrors = true;
							}
						});

				if (validationErrors) {
					$('div#noStoreSelected').show().focus();
					$(window).scrollTop(0);
				}
				return validationErrors;
			},
			
			selectFirstStore: function(){
				var $firstResult ='';
				$(".is-sf__result").each(function() {
					if(! $(this).hasClass("hide")){
						$firstResult = $(this);
						return false;
					}
				});

				if($firstResult != '' && $firstResult != undefined){
					var input = $firstResult.find("input[name='selectedStore']");
					if(input != undefined){
						$(input).click();
					}
				}
			}
}