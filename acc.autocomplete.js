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
ACC.autocomplete = {

	_autoload: [
		"bindSearchAutocomplete"
	],
	

	bindSearchAutocomplete: function ()
	{
		// extend the default autocomplete widget, to solve issue on multiple instances of the searchbox component
		$.widget( "custom.yautocomplete", $.ui.autocomplete, {
			_create:function(){
				
				

				// get instance specific options form the html data attr
				var option = this.element.data("options");
				// set the options to the widget
				this._setOptions({
					minLength: option.minCharactersBeforeRequest,
					displayProductImages: option.displayProductImages,
					delay: option.waitTimeBeforeRequest,
					autocompleteUrl: option.autocompleteUrl,
					source: this.source
				});

				// call the _super()
				$.ui.autocomplete.prototype._create.call(this);

			},
			options:{
				cache:{}, // init cache per instance
				focus: function (){return false;}, // prevent textfield value replacement on item focus
				select: function (event, ui){
                    window.location.href = ui.item.url;
                }
			},
			
			
			/*
			_renderItem : function (ul, item){
				
				console.log(ul);
				
				if (item.type == "autoSuggestion"){
					var renderHtml = "<a href='"+ item.url + "' ><div class='name'>" + item.value + "</div></a>";
					return $("<li>")
							.data("item.autocomplete", item)
							.append(renderHtml)
							.appendTo(ul);
				}
				else if (item.type == "productResult"){

					
					var renderHtml = "<a href='" + item.url + "' >";

					if (item.image != null){
						renderHtml += "<div class='thumb image-search-header'><img class='img-search-header' src='" + item.image + "'  /></div>";
					}

					renderHtml += 	"<div class='name'>" + item.value +"</div>";
					renderHtml += 	"<div class='price'>" + item.price +"</div>";
					renderHtml += 	"</a>";

					
					var productHTML = '<div class="is-navigation__subcategory__internal__item">';
					productHTML += '<div class="is-gridwallCard__item" data-url="/correr/ropa/nike/Legging-Nike/p/000000000123603005" is-component="GridwallCard">';
					productHTML += '<div class="is-gridwallCard__item__imageContainer">';
					productHTML += '<div class="is-gridwallCard__item__imageBackground" style="background-image: url(\'' + item.image + '\')"></div>';
					productHTML += "</div>";
					productHTML += '<span class="is-gridwallCard__item__name">' + item.value + '</span>';
					productHTML += '<span class="is-gridwallCard__item__price ">' + item.price + '</span>';
					productHTML += '</div></div>';
					
					//return $("div").data("item.autocomplete", item).append(productHTML).appendTo(ul);
					
					//return $("<li>").data("item.autocomplete", item).append(renderHtml).appendTo(ul);
				}
			},
			*/
			
			
			source: function (request, response)
			{
			
				
				console.time('autosuggestion');
				
				var self=this;
				var term = request.term.toLowerCase();
				
				
				if (term in self.options.cache)
				{
					
					var show = false;
					// Display suggestion widget
					if(self.options.cache["productsDesktop_" + term]!='') {
						// Get suggested products from cache
						var productsContainerDesktop = $('#desktopResults');
						productsContainerDesktop.html(self.options.cache["productsDesktop_" + term]);
						show = true;
					}
					if(self.options.cache["productsMobile_" + term]!='') {
						// Get suggested products from cache
						var productsContainerMobile = $('#mobileResults');
						productsContainerMobile.html(self.options.cache["productsMobile_" + term]);
						show = true;
					}
					if(self.options.cache["suggestions_" + term]!='') {
						// Get suggested terms from cache
						var suggestionsContainer = $('.is-navigation__subcategory__suggestions');
						suggestionsContainer.html(self.options.cache["suggestions_" + term]);
					}
						
						
					if(show) {	
						console.log("get element for term " + term + " from cache");
						$('.is-navigation__subcategory__internal.navigation-template-c').removeClass("fade-it");
						$('.is-navigation__search-bar__results').css('visibility', 'visible');
						$('.is-navigation__subcategory__internal__wrapper').css('height','auto');
					} 
					
					else {
						$('.is-navigation__subcategory__internal.navigation-template-c').addClass("fade-it");
						$('.is-navigation__search-bar__results').css('visibility', 'hidden');
					}
					
					console.timeEnd('autosuggestion');
					
					return null;
					//return response(self.options.cache[term]);
				}
				
				
				
				// Execute the AJAX call for solr query
				//$.getJSON(self.options.autocompleteUrl, {term: request.term}, function (data)
				//{

				$.get( self.options.autocompleteUrl+'?term='+request.term, function( data ) {
					
					if(data) {
						var autosuggestionResultsContainer = $('#autosuggestionResultsContainer');
						autosuggestionResultsContainer.html(data);
						autosuggestionResultsContainer.css('visibility', 'visible');
						
						// Store suggested prodcuts in cache
						var resultHTMLDesktop = $('#desktopResults').html();
						var resultHTMLMobile = $('#mobileResults').html();
						var resultHTMLSuggestion = $('.is-navigation__subcategory__suggestions').html();
						self.options.cache["productsDesktop_" + term] = resultHTMLDesktop;
						self.options.cache["productsMobile_" + term] = resultHTMLMobile;
						self.options.cache["suggestions_" + term] = resultHTMLSuggestion;
						
						self.options.cache[request.term] = request.term;

					}	
					
					console.timeEnd('autosuggestion');
					
					
					
					
					
					
					
					/*
					var autoSearchData = [];
					
					// Found suggested terms in response
					if(data.suggestions != null){
						// Clear suggested terms container
						var resultContainer = $('.is-navigation__subcategory__suggestions');
						resultContainer.html('');
						
						var resultsLabel = $('.is-navigation__search-bar__results').data('results-label')
						
						// Variable for HTML with suggested terms
						var resultHTML = '';
						resultHTML = '<li class="is-navigation__subcategory__suggestions__header is-hide-desktop"><span>' + resultsLabel + '</span></li>';
						
						// Iterate over all suggested terms
						$.each(data.suggestions, function (i, obj)
						{
							autoSearchData.push({
								value: obj.term,
								url: ACC.config.encodedContextPath + "/search?text=" + obj.term,
								type: "autoSuggestion"
							});
							
							resultHTML += '<li class="is-navigation__subcategory__suggestions__item ">';
							resultHTML += '<a href="/search?text=' + obj.term + '">';
							resultHTML += '<span class="is-navigation__subcategory__suggestions__item__typed">' + obj.term + '</span>';
							resultHTML += '</a></li>';
							
						});
						
						// Populate suggested terms container
						resultContainer.append(resultHTML);
						// Store suggested terms in cache
						self.options.cache["suggestions_" + term] = resultHTML;

					}

					
					// Found suggested products in cache
					if(data.products != null){
						
						// Clear suggested products container
						var resultContainerDesktop = $('#desktopResults');
						resultContainerDesktop.html('');

						var resultContainerMobile = $('#mobileResults');
						resultContainerMobile.html('');

						// Variable for HTML with suggested products
						var resultHTMLDesktop = '';
						
						var resultHTMLMobile = '<div class="is-relatedProducts" is-component="RelatedProducts" style="margin-top:0px;">';
						resultHTMLMobile += '<p class="is-relatedProducts__title"></p>';
						resultHTMLMobile += '<div class="is-relatedProducts-wrapper">';
						resultHTMLMobile += '<div class="is-relatedProducts__items" style="width:734px;">';
						
						// Iterate over all suggested products
						$.each(data.products, function (i, obj)
						{
							autoSearchData.push({
								value: obj.name,
								code: obj.code,
								desc: obj.description,
								manufacturer: obj.manufacturer,
								url:  ACC.config.encodedContextPath + obj.url,
								price: (obj.price != null ? obj.price.formattedValue : ""),
								type: "productResult",
								image: (obj.images!=null && self.options.displayProductImages) ? obj.images[0].url : null // prevent errors if obj.images = null
							});
							
							
							resultHTMLDesktop += '<div class="is-navigation__subcategory__internal__item">';
							resultHTMLDesktop += '<div class="is-gridwallCard__item" is-component="GridwallCard">';
							if(obj.promoFlag) {
							    var promoFlagTranslated = obj.promoFlagLabel;
//							    switch(obj.promoFlag) {
//							        case "new":
//							            promoFlagTranslated = "Nuevo";
//							            break;
//							        case "hot":
//							            promoFlagTranslated = "Hot";
//							            break;
//							        case "exclusive":
//							            promoFlagTranslated = "Exclusivo";
//							            break;
//							        case "limited":
//							            promoFlagTranslated = "Limitado";
//							            break;
//							        case "topSeller":
//							            promoFlagTranslated = "M\u00E1s Vendido";
//							            break;
//							    }
							    resultHTMLDesktop += '<div class="is-promoTag"><a href="/search/?text=' + obj.promoFlag + '" class="is-promoTag__tag ' + obj.promoFlag + '" target="_blank">';
                                resultHTMLDesktop += promoFlagTranslated + '</a></div>';
							}

							if(obj.baseProduct !== null) {
								resultHTMLDesktop += '<a href="/p/' + obj.baseProduct + '"><div class="is-gridwallCard__item__imageContainer">';
							}
							else {
								resultHTMLDesktop += '<a href="/p/' + obj.code + '"><div class="is-gridwallCard__item__imageContainer">';
							}
							
							if(obj.images && obj.images.length>1) {
								resultHTMLDesktop += '<div class="is-gridwallCard__item__imageBackground" style="background-image: url(\'' + obj.images[1].url + '\')" />';
							}
							else if(obj.images && obj.images.length>0) {
								resultHTMLDesktop += '<div class="is-gridwallCard__item__imageBackground" style="background-image: url(\'' + obj.images[0].url + '\')" />';
							}
							else {
								resultHTMLDesktop += '<div class="is-gridwallCard__item__imageBackground" />';
							}
							resultHTMLDesktop += '</div>';
							if(obj.brand && !obj.genderCategory) {
							    resultHTMLDesktop += '<span class="is-gridwallCard__item__brand">' + obj.brand + '</span>';
							}
							else if(!obj.brand && obj.genderCategory) {
							    resultHTMLDesktop += '<span class="is-gridwallCard__item__gender">' + obj.genderCategory + '</span>';
							}
							else if(obj.brand && obj.genderCategory) {
								resultHTMLDesktop += '<span class="is-gridwallCard__item__brand">' + obj.brand + '</span><br>';
								resultHTMLDesktop += '<span class="is-gridwallCard__item__gender">' + obj.genderCategory + '</span>';
							}
							resultHTMLDesktop += '<span class="is-gridwallCard__item__name">' + obj.formattedBaseName + '</span>';
							
							var hasDiscount = false;
							var currentPriceClass = "is-gridwallCard__item__price";
							if(obj.highestPrice && (100 - Math.round(obj.price.value * 100 / obj.highestPrice.value)) >= 10) {
								resultHTMLDesktop += '<span class="is-gridwallCard__item__oldPrice">' + obj.highestPrice.formattedValue + '</span>';
								currentPriceClass = currentPriceClass + " inlinePrice promo-price";
								hasDiscount = true;
							}
							if(obj.previousPrice && (100 - Math.round(obj.price.value * 100 / obj.previousPrice.value)) >= 10) {
								resultHTMLDesktop += '<span class="is-gridwallCard__item__oldPrice">' + obj.previousPrice.formattedValue + '</span>';
								currentPriceClass = currentPriceClass + " inlinePrice promo-price";
								hasDiscount = true;
							}
							if(obj.price) {
							    resultHTMLDesktop += '<span class="' + currentPriceClass + '">';
							    resultHTMLDesktop += obj.price.formattedHtmlValue;
							    resultHTMLDesktop += '</span>';
							}
							
							
							if(obj.productDiscount && !obj.promotionDiscount) {
								resultHTMLDesktop += '<span class="off-tag">OFF</span>';
								resultHTMLDesktop += '<span class="product-ico-product product-ico-sale">-' + obj.productDiscount + '%</span>'; 
							}
							else if(!obj.promotionDiscount && obj.promotionDiscount) {
								resultHTMLDesktop += '<span class="off-tag">OFF</span>';
								resultHTMLDesktop += '<span class="product-ico-product product-ico-sale">-' + obj.promotionDiscount + '%</span>'; 
							}
							else if(obj.promotionDiscount && obj.promotionDiscount) {
								resultHTMLDesktop += '<span class="off-tag">OFF</span>';
								resultHTMLDesktop += '<span class="product-ico-product product-ico-sale">-' + obj.promotionDiscount + '%</span>'; 
								resultHTMLDesktop += '<span class="product-ico-product product-ico-sale ico-promo">-' + obj.promotionDiscount + '%</span>';
							}

							

							if(obj.goodFor) {
							    var goodForTranslated = obj.goodForLabel;
//                                switch(obj.goodFor) {
//                                    case "NEUTRAL_PRONATORS":
//                                        goodForTranslated = "Pronadores Neutrales";
//                                        break;
//                                    case "SUPINATORS":
//                                        goodForTranslated = "Supinadores";
//                                        break;
//                                    case "OVERPRONATORS":
//                                        goodForTranslated = "Sobrepronadores";
//                                        break;
//                                    case "HALF_MARATHON":
//                                        goodForTranslated = "Medio Marat&oacute;n";
//                                        break;
//                                    case "MARATHON":
//                                        goodForTranslated = "Marat&oacute;n";
//                                        break;
//                                    case "FIVE_TEN_KM":
//                                        goodForTranslated = "5-10 km";
//                                        break;
//                                    case "TRAIL_RUNNING":
//                                        goodForTranslated = "Trail Running";
//                                        break;
//                                    case "LOW_IMPACT_ACTIVITY":
//                                        goodForTranslated = "Actividad De Impacto Bajo";
//                                        break;
//                                    case "MEDIUM_IMPACT_ACTIVITY":
//                                        goodForTranslated = "Actividad De Impacto Medio";
//                                        break;
//                                    case "HIGH_IMPACT_ACTIVITY":
//                                        goodForTranslated = "Actividad De Impacto Alto";
//                                        break;
//                                    case "NATURAL_GRASS":
//                                        goodForTranslated = "C&eacute;sped Natural";
//                                        break;
//                                    case "ARTIFICIAL_GRASS":
//                                        goodForTranslated = "C&eacute;sped Artificial";
//                                        break;
//                                    case "NATURAL_ARTIFICIAL_GRASS":
//                                        goodForTranslated = "C&eacute;sped Natural/Artificial";
//                                        break;
//                                    case "FIRM_GROUND":
//                                        goodForTranslated = "Terreno Firme";
//                                        break;
//                                    case "INDOOR_FOOTBALL":
//                                        goodForTranslated = "F&uacute;tbol sala";
//                                        break;
//                                }
                                resultHTMLDesktop += '<span class="is-gridwallCard__item__performance">Bueno para ' + goodForTranslated + '</span>';
							}
							

							resultHTMLDesktop += '</a></div></div>';
							
							
							
							if(i==0) {
								resultHTMLMobile += '<div class="is-relatedProducts__item" style="width: 171px;">';
							}
							else {
								resultHTMLMobile += '<div class="is-relatedProducts__item" style="width: 171px; float:left; padding-left:10px; position:relative">';
							}
							
							resultHTMLMobile += '<div class="is-gridwallCard__item" is-component="GridwallCard">'

							if(obj.promoFlag) {
							    var promoFlagTranslated = obj.promoFlagLabel;
//                                    switch(obj.promoFlag) {
//                                	    case "new":
//                                	        promoFlagTranslated = "Nuevo";
//                                	        break;
//                                	    case "hot":
//                                	        promoFlagTranslated = "Hot";
//                                	        break;
//                                    	case "exclusive":
//                                    	    promoFlagTranslated = "Exclusivo";
//                                    	    break;
//                                    	case "limited":
//                                    	    promoFlagTranslated = "Limitado";
//                                    	    break;
//                                    	case "topSeller":
//                                    	    promoFlagTranslated = "M\u00E1s Vendido";
//                                    	    break;
//                                	}
                                	resultHTMLMobile += '<div class="is-promoTag"><a href="/search/?text=' + obj.promoFlag + '" class="is-promoTag__tag ' + obj.promoFlag + '" target="_blank">';
                                    resultHTMLMobile += promoFlagTranslated + '</a></div>';
							}

							if(obj.baseProduct !== null) {
								resultHTMLMobile += '<a href="/p/' + obj.baseProduct + '"><div class="is-gridwallCard__item__imageContainer">';
							}
							else {
								resultHTMLMobile += '<a href="/p/' + obj.code + '"><div class="is-gridwallCard__item__imageContainer">';
							}
								
							if(obj.images && obj.images.length>1) {
								resultHTMLMobile += '<div class="is-gridwallCard__item__imageBackground" style="background-image: url(\'' + obj.images[1].url + '\')" />';

							}
							else if(obj.images && obj.images.length>0) {
								resultHTMLMobile += '<div class="is-gridwallCard__item__imageBackground" style="background-image: url(\'' + obj.images[0].url + '\')" />';
							}
							else {
								resultHTMLMobile += '<div class="is-gridwallCard__item__imageBackground" />';
							}
							resultHTMLMobile += '</div>';
							
							if(obj.brand && !obj.genderCategory) {
							    resultHTMLMobile += '<span class="is-gridwallCard__item__brand">' + obj.brand + '</span>';
							}
							else if(!obj.brand && obj.genderCategory) {
							    resultHTMLMobile += '<span class="is-gridwallCard__item__gender">' + obj.genderCategory + '</span>';
							}
							else if(obj.brand && obj.genderCategory) {
								resultHTMLMobile += '<span class="is-gridwallCard__item__brand">' + obj.brand + '</span><br>';
								resultHTMLMobile += '<span class="is-gridwallCard__item__gender">' + obj.genderCategory + '</span>';
							}
							resultHTMLMobile += '<span class="is-gridwallCard__item__name">' + obj.formattedBaseName + '</span>';
							
							
							var hasDiscount = false;
							var currentPriceClass = "is-gridwallCard__item__price";
							if(obj.highestPrice && (100 - Math.round(obj.price.value * 100 / obj.highestPrice.value)) >= 10) {
								resultHTMLMobile += '<span class="is-gridwallCard__item__oldPrice">' + obj.highestPrice.formattedValue + '</span>';
								currentPriceClass = currentPriceClass + " inlinePrice promo-price";
								hasDiscount = true;
							}
							if(obj.previousPrice && (100 - Math.round(obj.price.value * 100 / obj.previousPrice.value)) >= 10) {
								resultHTMLMobile += '<span class="is-gridwallCard__item__oldPrice">' + obj.previousPrice.formattedValue + '</span>';
								currentPriceClass = currentPriceClass + " inlinePrice promo-price";
								hasDiscount = true;
							}
							if(obj.price) {
								resultHTMLMobile += '<span class="' + currentPriceClass + '">';
								resultHTMLMobile += obj.price.formattedHtmlValue;
								resultHTMLMobile += '</span>';
							}
							
							
							if(obj.productDiscount && !obj.promotionDiscount) {
								resultHTMLMobile += '<span class="off-tag">OFF</span>';
								resultHTMLMobile += '<span class="product-ico-product product-ico-sale">-' + obj.productDiscount + '%</span>'; 
							}
							else if(!obj.promotionDiscount && obj.promotionDiscount) {
								resultHTMLMobile += '<span class="off-tag">OFF</span>';
								resultHTMLMobile += '<span class="product-ico-product product-ico-sale">-' + obj.promotionDiscount + '%</span>'; 
							}
							else if(obj.promotionDiscount && obj.promotionDiscount) {
								resultHTMLMobile += '<span class="off-tag">OFF</span>';
								resultHTMLMobile += '<span class="product-ico-product product-ico-sale">-' + obj.promotionDiscount + '%</span>'; 
								resultHTMLMobile += '<span class="product-ico-product product-ico-sale ico-promo">-' + obj.promotionDiscount + '%</span>';
							}							
							
							
							

							
							if(obj.goodFor) {
							    var goodForTranslated = obj.goodForLabel;
//						        switch(obj.goodFor) {
//                                    case "NEUTRAL_PRONATORS":
//                                        goodForTranslated = "Pronadores Neutrales";
//                                        break;
//                                    case "SUPINATORS":
//                                        goodForTranslated = "Supinadores";
//                                        break;
//                                    case "OVERPRONATORS":
//                                        goodForTranslated = "Sobrepronadores";
//                                        break;
//                                    case "HALF_MARATHON":
//                                        goodForTranslated = "Medio Marat&oacute;n";
//                                        break;
//                                    case "MARATHON":
//                                        goodForTranslated = "Marat&oacute;n";
//                                        break;
//                                    case "FIVE_TEN_KM":
//                                        goodForTranslated = "5-10 km";
//                                        break;
//                                    case "TRAIL_RUNNING":
//                                        goodForTranslated = "Trail Running";
//                                        break;
//                                    case "LOW_IMPACT_ACTIVITY":
//                                        goodForTranslated = "Actividad De Impacto Bajo";
//                                        break;
//                                    case "MEDIUM_IMPACT_ACTIVITY":
//                                        goodForTranslated = "Actividad De Impacto Medio";
//                                        break;
//                                    case "HIGH_IMPACT_ACTIVITY":
//                                        goodForTranslated = "Actividad De Impacto Alto";
//                                        break;
//                                    case "NATURAL_GRASS":
//                                        goodForTranslated = "C&eacute;sped Natural";
//                                        break;
//                                    case "ARTIFICIAL_GRASS":
//                                        goodForTranslated = "C&eacute;sped Artificial";
//                                        break;
//                                    case "NATURAL_ARTIFICIAL_GRASS":
//                                        goodForTranslated = "C&eacute;sped Natural/Artificial";
//                                        break;
//                                    case "FIRM_GROUND":
//                                        goodForTranslated = "Terreno Firme";
//                                        break;
//                                    case "INDOOR_FOOTBALL":
//                                        goodForTranslated = "F&uacute;tbol sala";
//                                        break;
//                                }
							    resultHTMLMobile += '<span class="is-gridwallCard__item__performance">Bueno para ' + goodForTranslated + '</span>';
							}
							resultHTMLMobile += '</a></div></div>';
							
						});
						
						
						if(data.products.length > 0 && data.products.length < 4) {
							var diff = 4 - data.products.length;
							for(i=0; i<diff; i++) {
								resultHTMLDesktop += '<div class="is-navigation__subcategory__internal__item">';
								resultHTMLDesktop += '<div class="is-gridwallCard__item" is-component="GridwallCard">';
								resultHTMLDesktop += '<span class="is-gridwallCard__item__brand"></span>';	
								resultHTMLDesktop += '<span class="is-gridwallCard__item__name"></span>';	
								resultHTMLDesktop += '<span class="is-gridwallCard__item__price "></span>';
								resultHTMLDesktop += '</div></div>';

								
								resultHTMLMobile += '<div class="is-relatedProducts__item" style="width: 114.375px;">';
								resultHTMLMobile += '<div class="is-gridwallCard__item" is-component="GridwallCard">'
								resultHTMLMobile += '<span class="is-gridwallCard__item__brand"></span>';
								resultHTMLMobile += '<span class="is-gridwallCard__item__name"></span>';
								resultHTMLMobile += '<span class="is-gridwallCard__item__price "></span>';
								resultHTMLMobile += '</div></div>';

							}
						}
						

						
						
						resultHTMLMobile += '</div></div></div>';
						
						// Populate suggested products container
						resultContainerDesktop.append(resultHTMLDesktop);
						resultContainerMobile.append(resultHTMLMobile);
						// Store suggested prodcuts in cache
						self.options.cache["productsDesktop_" + term] = resultHTMLDesktop;
						self.options.cache["productsMobile_" + term] = resultHTMLMobile;
						
						// Display suggestion widget
						if(resultHTMLDesktop != '') {
							$('.is-navigation__subcategory__internal.navigation-template-c').removeClass("fade-it");
							$('.is-navigation__search-bar__results').css('visibility', 'visible');
							$('.is-navigation__subcategory__internal__wrapper').css('height','auto');
							
						}
						else {
							$('.is-navigation__subcategory__internal.navigation-template-c').addClass("fade-it");
							$('.is-navigation__search-bar__results').css('visibility', 'hidden');
						}

						
						
					}
					self.options.cache[term] = autoSearchData;
					//return response(autoSearchData);
					
					
					*/
					
					
					return null;
				});
			}

		});
		$(".js-site-search-input-innvictus").focus(function(){
			$('.nav__links--products').fadeTo( 500, 0 , function(){
				$('.nav__links--products').hide();
			});
		});
		$(".js-site-search-input-innvictus").focusout(function(){
			$('.nav__links--products').fadeTo( 500, 1  );
		});

		$search = $(".js-site-search-input");
		if($search.length>0){
			$search.yautocomplete()
		}
	}
};