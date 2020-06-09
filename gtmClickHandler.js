ACC.gtmClickHandler = {

		_autoload: [
			"productClickHandler",
			"promotionClickHandler",
			"navigationClickHandler",
			],

			productClickHandler : function () {
				$(document).on("click", ".js-gtm-product-click", function (e) {
					var productCode = $(this).data("productcode");
					var productName = $(this).data("productname");

					var productData = {
							"productCode" : productCode,
							"productName" : productName
					};

					window.mediator.publish('gtmTrackProductClick',{
						productData : productData
					});
				});
			},

			promotionClickHandler : function () {
				$(document).on("click", ".js-track-promo", function (e) {
					var promoCode = $(this).data("promocode");
					var promoName = $(this).data("promoname")
					
					var promotionData = {
							"promoCode" : promoCode,
							"promoName" : promoName
					};

					window.mediator.publish('gtmTrackPromotionClick',{
						promotionData : promotionData
					});
				});
			},

			navigationClickHandler : function(){
				$(document).on("click", ".is-navigation__desktop-menu a , .is-navigation__mobile-menu a", function (e) {
					var link = $(this);
					var menuPathName = '';
					var nameLink = $.trim(link.text());

					//Desktop
					if(link.parents('.is-navigation__desktop-menu').length){
						if(link.hasClass('is-navigation__subcategory__main-title')||link.hasClass('is-navigation__main__center__label')){
							menuPathName = nameLink;
						}else{
							var parent = $.trim(link.parents('.is-navigation__subcategory').find('.is-navigation__subcategory__main-title').text());
							var subparent = $.trim(link.parents('.is-navigation__subcategory-list').find('.is-navigation__subcategory-title').text());

							if(parent != ''){
								menuPathName+= parent + ' > ';
							}
							if(subparent != ''){
								menuPathName+= subparent + ' > ';
							}
							menuPathName+= nameLink;
						}
					}

					//Mobile
					if(link.parents('.is-navigation__mobile-menu').length){
						var menuPathName = '';
						var parent = $.trim(link.parents('.is-navigation__main__center').find('.is-navigation__subcategory__main-title').text());
						var parentMenu = $.trim($('.is-navigation__mobile-menu__header__back__text').text());
						var subparent = $.trim(link.parents('.is-navigation__main__center__second').find('.is-navigation__subcategory-title').text());

						if(!link.hasClass('is-navigation__subcategory__main-title')){
							if(parent==''){
								menuPathName+= parentMenu+" > ";
							}else{
								menuPathName+= parent+" > ";
							}

							if(subparent != ''){
								menuPathName+= subparent + ' > ';
							}
						}
						menuPathName+= nameLink;
					}

					window.mediator.publish('gtmMenuClick',{
						menuPathName : menuPathName
					});

				});
			}
}
