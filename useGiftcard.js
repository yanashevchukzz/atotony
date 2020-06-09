ACC.useGiftcard = {

	_autoload : [ [ "binduseGiftcardLink", $('.js-use-giftcard').length != 0 ]

	],

	binduseGiftcardLink : function() {
		$(document).on("click", ".js-use-giftcard", function(e) {
			e.preventDefault();
			var url = $(this).data("useGiftCardUrl");
			var popupTitle = $(this).data('delete-popup-title');
			ACC.colorbox.showLoader();
			ACC.colorbox.open(popupTitle, {
				href: url,
                width: "400px",
                scrolling: true,
				onComplete : function() {
					$(".giftCard-total").html();
					ACC.colorbox.resize();
				}
			});
		});
		 $(document).on("click",".js-use-giftcard-close-button", function(e){
	            e.preventDefault();
	            ACC.colorbox.close();
	        });
	}
}