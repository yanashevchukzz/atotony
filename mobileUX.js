 	if($('#colorways_mobile_list').length) {
 		var colorwaysMobileList = $('#colorways_mobile_list').detach();
 		$('#colorwaysMobile').append(colorwaysMobileList);	
 		var colorwaysMobileModal = $('#colorwaysMobileModal').detach();
 		$('#colorwaysMobile').append(colorwaysMobileModal);
 	}
 	else {
 		$('#colorwaysMobile').remove();
 	}
 	
 	if($('.is-sizeSelector__sizes').length) {
 		var sizeselectorMobileList = $('.is-sizeSelector__sizes').clone();
 		$('#sizeselectorMobile').append(sizeselectorMobileList);

 		if($('.is-sizeSelector__availability-wrapper.clear').length) {
 	 		var sizeavailabilityMobile = $('.is-sizeSelector__availability-wrapper.clear').clone();
 	 		$('#sizeselectorMobile').append(sizeavailabilityMobile);
 	 	}
 		
 		if($('#sizeSelectorModal').length) {
 			var sizeselectorModal = $('#sizeSelectorModal').clone();
 	 		$('#sizeselectorMobile').append(sizeselectorModal);
 		}
 	}
 	else {
 		$('#sizeselectorMobile').remove();
 	}

 	
 	if($('.is-sizeGuide').length) {
 		var sizeGuide = $('.is-sizeGuide').clone();
 		$('#sizeMobileContainer').append(sizeGuide);
 	}
 	
//  	if($('.is-quantitySelector.js-qty-selector').length) {
// 		var quantitySelector = $('.is-quantitySelector.js-qty-selector').clone();
// 		$('#quantitySelectorMobileConatiner').append(quantitySelector);
// 	}
  	

  	if($('#categoryNavigationComponent').length) {
 		var categoryNavigationComponent = $('#categoryNavigationComponent').clone();
 		$('#categoryNavigationMobileComponent').append(categoryNavigationComponent.html());
 	}

 	if($('.personalization').length) {
 		var personalizationButton = $('.personalization').clone();
 		$('.is-bt-mobile__ctas').prepend(personalizationButton);
 	}