function EmarsysCarousel(options) {
    this.buildEmarsysCarousel = function(SC, render) {
        var recommendedItems = [];
        for (var i = 0, l = SC.page.products.length; i < l; i++) {
          recommendedItems.push(SC.page.products[i].id);
        }
        //recommendedItems = ["000000000000117147","000000000122512002","000000000117568003","000000000122512001","000000000122512003","000000000117568001","000000000117568001","000000000117568001","000000000117568001","000000000117568001","000000000117568001","000000000117568001","000000000117568001"];
        options.referenceProductCodes = JSON.stringify(recommendedItems);
        $.ajax({
            url: "/p/emarsysRelatedProducts",
            data: options,
            type: 'POST',
            success: function (data) {
            	
            	//var parentContainer = $('#RelatedProductsTemporaryContainer_'+options.componentId).parent();
            	var carouselContainer = $('#RelatedProducts-'+options.componentId);
            	$(carouselContainer).html(data);
            	
                // async init the RelatedProducts component
                ISF.app.initComponent('RelatedProducts', document.getElementById(options.containerId));
        		// init all gridwallCards inside related products
                $('#' + options.containerId + ' [is-component="GridwallCard"]').each(function () {
                    ISF.app.initComponent('GridwallCard', this);
                });
                    
            },
            error: function (xht, textStatus, ex) {
                var errorMsg = "Failed to get related products from Emarsys for the component: " + options.componentId + ".";
                errorMsg += " Error details [" + xht + ", " + textStatus + ", " + ex + "]";
                console.error(errorMsg);
            }
        });
    };
}