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
ACC.wishlist = {

    _autoload: [
        ["bindDeleteWishlistLink", $('.js-delete-wishlist').length != 0],
        ["bindDeleteConfirmLink", $('.js-wishlist_delete_confirm').length != 0],
        ["bindUpdateComment", $('.js-wishlist_update_comment').length != 0],
        ["bindUpdateQuantity", $('.js-wishlist_update_qty').length != 0],
        ["bindShowHideComment", $(".js-wishlist_show_comment").length != 0],
        ["bindShareWishlist", $("#share_wishlist").length != 0]
     
    ],
    
    $wishlistRestoreBtn: {},
    $currentCartName: {},



    bindDeleteWishlistLink: function () {
        $(document).on("click", '.js-delete-wishlist', function (event) {
            event.preventDefault();
            var cartId = $(this).data('wishlist-id');
            var popupTitle = $(this).data('delete-popup-title');
           
            var cboxOptions = {
            		width: '95%',
            		maxWidth: '480px',
            	}
            ACC.colorbox.open(popupTitle, {
                inline: true,
                className: "js-wishlist_delete_confirm_modal",
                href: "#popup_confirm_wishlist_delete_" + cartId,
                maxWidth: "100%",
                width: window.innerWidth > parseInt(cboxOptions.maxWidth) ? cboxOptions.maxWidth : cboxOptions.width,
                onComplete: function () {
                    $(this).colorbox.resize();
                }
            });
        });
    },

    bindDeleteConfirmLink: function () {
        $(document).on("click", '.js-wishlist_delete_confirm', function (event) {
            event.preventDefault();
            var productCode = $(this).data('wishlist-id');
            var url = ACC.config.encodedContextPath + '/my-account/wishlist/' + productCode + '/delete';
            $.ajax({
                url: url,
                type: 'GET',
                success: function (response) {
                    ACC.colorbox.close();
                    var url = ACC.config.encodedContextPath + "/my-account/wishlist"
                    window.location.replace(url);
                }
            });
        });

        $(document).on("click", '.js-wishlist_delete_confirm_cancel', function (event) {
            ACC.colorbox.close();
        });
    },
    
    bindUpdateComment: function () {
        $(document).on("change", '.js-wishlist_update_comment', function (event) {
            event.preventDefault();
            var productCode = $(this).data('wishlist-id');
            var enteredComment = $(this).val();
            
            var url = ACC.config.encodedContextPath + '/my-account/wishlist/' + productCode + '/update-comment';
            $.ajax({
                url: url,
                data: {comment:enteredComment},
                type: 'POST',
                success: function (response) {
                    //var url = ACC.config.encodedContextPath + "/my-account/wishlist"
                    //window.location.replace(url);
                	//alert("OK");
                },
                error: function (xhr, ajaxOptions, thrownError) {
                	  
                	
                  }
            });
        });

        $(document).on("click", '.js-wishlist_delete_confirm_cancel', function (event) {
            ACC.colorbox.close();
        });
    },
    
    bindUpdateQuantity: function () {
        $(document).on("change", '.js-wishlist_update_qty', function (event) {
            event.preventDefault();
            var productCode = $(this).data('wishlist-id');
            var enteredComment = $(this).val();
            
            var url = ACC.config.encodedContextPath + '/my-account/wishlist/' + productCode + '/update-qty';
            $.ajax({
                url: url,
                data: {qty:enteredComment},
                type: 'POST',
                success: function (response) {
                    //var url = ACC.config.encodedContextPath + "/my-account/wishlist"
                    //window.location.replace(url);
                },
                error: function (status) {
                    // $('.js-wishlist_update_qty.'+productCode).addClass('has-error');
                    // $('.js-restore-error-container').html('<h2>'+productCode+' not updated <h2>');
                     
                  }
            });
        });

        $(document).on("click", '.js-wishlist_delete_confirm_cancel', function (event) {
            ACC.colorbox.close();
        });
    },
    
    bindShowHideComment: function ()
	{
    	 $(document).on("click", '.js-wishlist_show_comment', function (event) {
    		 var comment = $($(this).attr('href'));
    		 
    		  if(comment.is(":visible"))
                  comment.hide();
              else
                  comment.show();
  	        return false;
    	 });
	},
    
    bindShareWishlist: function ()
	{
    	
    	
    	 $(document).on("click", '#share_wishlist', function (event) {
    		
    	 });
	}
	
}

