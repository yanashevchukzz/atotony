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
ACC.productDetail = {

	_autoload : [ "onloadPresale", "checkMaxSelectableQty", "initPageEvents", "bindVariantOptions",
	              "bindPersonalizeTeam", "addLaunchDate", "submitRestockNotification", "validateEmail", "enableButtons",
	              "bindDisableAddToCartButtonDesktop", "loadGBModel" ],

	onloadPresale : function() {
		if ($('#isLaunchProduct').val() == 'true') {
			//ACC.productDetail.countdown();
		}
		if ($('#presale').val() == 'true') {
			ACC.productDetail.preOrderCountdown();
		}
	},

    disableButtons : function(){
        $('[id^="addToCartButtonDesktop"]').addClass("disabled");
        $('[id^="addToCartButtonMobile"]').addClass("disabled");
    },

	enableButtons : function(){
	    $('[id^="addToCartButtonDesktop"]').removeClass("disabled");
        $('[id^="addToCartButtonMobile"]').removeClass("disabled");
	},

	bindDisableAddToCartButtonDesktop : function() {
    	$('[id^="addToCartButtonDesktop"]').click(function (event) {
            $(this).addClass("disabled");
        });

        $('[id^="addToCartButtonMobile"]').click(function (event) {
            $(this).addClass("disabled");
        });
	},

	countdown : function() {
		var deadline = $("#launchDate").val();
		var x = setInterval(function() {
			var now = new Date().getTime();
			var t = deadline - now;

			var days = Math.floor(t / (1000 * 60 * 60 * 24));
			var hours = Math.floor((t % (1000 * 60 * 60 * 24))
					/ (1000 * 60 * 60));
			var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((t % (1000 * 60)) / 1000);

			document.getElementById("dias").innerHTML = days
			document.getElementById("hours").innerHTML = hours
			document.getElementById("minutes").innerHTML = minutes
			document.getElementById("seconds").innerHTML = seconds

			$(".prox-text").show();

			// if(days == 0 && hours == 0 && minutes==0 && seconds==0){
			// window.location.reload();
			// }

			// document.getElementById("proximaDate").innerHTML = days + " días
			// "
			// + hours + " horas " + minutes + " min " + seconds + " seg ";
			//
			if (t < 0) {
				window.location.reload(true);
			}
		}, 1000);
	},

	preOrderCountdown : function() {
		var deadline = $("#launchDate").val();
		var x = setInterval(function() {
			var now = new Date().getTime();
			var t = deadline - now;

			if (t < 0) {
				window.location.reload(true);
			}
		}, 1000);
	},

	checkMaxSelectableQty : function() {
        ACC.productDetail.checkMaxSelectableQtyById("pdpAddtoCartInput");
        ACC.productDetail.checkMaxSelectableQtyById("pdpAddtoCartInputMobile");
    },

    checkMaxSelectableQtyById : function(inputId) {
        var input = $("#" + inputId);
        var max = input.data("max");
        var min = input.data("min");

        if (min >= max) {
            $(".js-qty-selector-minus").attr("disabled", true);
            $(".js-qty-selector-plus").attr("disabled", true);
            input.attr("disabled", true);
        }
        else{
            $(".js-qty-selector-minus").attr("disabled", false);
            $(".js-qty-selector-plus").attr("disabled", false);
            input.attr("disabled", false);
        }
    },

	addLaunchDate : function() {
		$('.innvictus-body .preorder-launch-date').appendTo(
				'.AddToCart-PickUpInStoreAction').removeClass('hidden');
		$('.innovasport-body .preorder-launch-date').prependTo(
				'.AddToCart-ShareOnSocialNetworkAction').removeClass('hidden');
	},

	checkQtySelector : function(self, mode) {
        var input = $(self).parents(".js-qty-selector").find(".js-qty-selector-input");
        var inputVal = parseInt(input.val());
        var max = input.data("max");

        $("#is-quantitySelector__notice").text("");
        $("#is-quantitySelector__noticeMobile").text("");

        if (mode == "minus") {
            if (inputVal > 1) {
                ACC.productDetail.updateQtyValue(self, inputVal-1);
                input.val(inputVal-1);
            }
        } else if (mode == "reset") {
            ACC.productDetail.updateQtyValue(self, 1)

        } else if (mode == "plus") {
            if (inputVal < max || max == "FORCE_IN_STOCK") {
                ACC.productDetail.updateQtyValue(self, inputVal+1);
                input.val(inputVal+1);
            }
            else {
                $("#is-quantitySelector__notice").text($("#is-quantitySelector__notice").data("maxreached"));
                $("#is-quantitySelector__noticeMobile").text($("#is-quantitySelector__noticeMobile").data("maxreached"));
            }
        } else if (mode == "input") {
            if (max == "FORCE_IN_STOCK" && inputVal > 0) {
                ACC.productDetail.updateQtyValue(self, inputVal)
            }
            else if (inputVal < 1) {
                $(self).parents(".js-qty-selector").find(".js-qty-selector-input").val(1);
                ACC.productDetail.updateQtyValue(self, 1)
            } else if (inputVal > max) {
                $(self).parents(".js-qty-selector").find(".js-qty-selector-input").val(max);
                ACC.productDetail.updateQtyValue(self, max);
                $("#is-quantitySelector__notice").text($("#is-quantitySelector__notice").data("maxreached"));
                $("#is-quantitySelector__noticeMobile").text($("#is-quantitySelector__noticeMobile").data("maxreached"));
            }
            else {
                ACC.productDetail.updateQtyValue(self, inputVal);
            }
        }

    },

	updateQtyValue : function(self, value) {
		// var input =
		// $(self).parents(".js-qty-selector").find(".js-qty-selector-input");
		// var addtocartQty =
		// $(self).parents(".addtocart-component").find("#addToCartForm").find(".js-qty-selector-input");

		var addtocartQty = $("#addToCartForm").find(".js-qty-selector-input");
		if(value<=0) {
			addtocartQty.val(1);
		}
		else {
			addtocartQty.val(value);
		}

		var cantidad = $("#selected-cantidad");
		if(value > 0){
			cantidad.text(value);
		}
		else {
			cantidad.text("");
		}

	},

    getNewProductSize : function (newProductCode) {

        ACC.productDetail.disableButtons();
        var reopenBuyingTool = ACC.productDetail.loader.openColorBox();

        var productCode = $("#baseProductCode").val();

        $.ajax({
            url: "/p/" + productCode + "/getNewProductDetail",
            type: 'POST',
            data: {newProductCode: newProductCode},
            success: function (response)
            {
                ACC.productDetail.sizeChange.updateProductInfo(response);
                ACC.productDetail.enableButtons();
                ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal(reopenBuyingTool);
            },
            error: function (response){
                console.log(response);
                ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal();
            }
        });
    },

    updateCurrentProductInfo : function () {

        ACC.productDetail.loader.openColorBox();

        var baseProductCode = $("#baseProductCode").val();
        var currentProductCode = document.getElementById("variantProductCode").value;

        $.ajax({
            url: "/p/" + baseProductCode + "/getNewProductDetail",
            type: 'POST',
            data: {newProductCode: currentProductCode, lightMode: true},
            success: function (response)
            {
                ACC.productDetail.sizeChange.updateProductInfo(response);
                ACC.productDetail.enableButtons();
                ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal();
            },
            error: function (response){
                console.log(response);
                ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal();
            }
        });
    },

    sizeChange : {

        updateProductInfo : function(response){
            var previousProductCode = document.getElementById("variantProductCode").value;

            var responseObj = JSON.parse(response);
            var productResp = JSON.parse(responseObj.productData);
            var primaryImage = JSON.parse(responseObj.primaryImage);
            var pageType = responseObj.pageType;
            var metaKeywords = responseObj.metaKeywords;
            var metaDescription = responseObj.metaDescription;

            ACC.productDetail.sizeChange.promoFlagSection(productResp);
            ACC.productDetail.sizeChange.titleSection(productResp);
            ACC.productDetail.sizeChange.priceInfoSection(productResp);
            ACC.productDetail.sizeChange.buyingToolInfoSection(productResp);
            ACC.productDetail.sizeChange.wishlistSection(productResp);
            ACC.productDetail.sizeChange.selectorsSection(productResp);
            ACC.productDetail.sizeChange.personalizationSection(productResp, previousProductCode);
            ACC.productDetail.sizeChange.colorWaysSection(productResp, primaryImage, responseObj.localResources);

            ACC.productDetail.sizeChange.metaTags(metaKeywords, metaDescription);
            ACC.productDetail.sizeChange.utilsScripts(productResp, pageType, previousProductCode);

            ACC.productDetail.sizeChange.socialMediaSection(productResp);
            ACC.productDetail.sizeChange.addToCartSection(productResp);
            ACC.productDetail.sizeChange.storeFinderSection(productResp);
            ACC.productDetail.sizeChange.moreHiddenInputs(productResp);
        },

        promoFlagSection : function(productResp){
            document.getElementById("promoFlagSection").style.display = "none";
            if (productResp.promoFlag !== undefined && productResp.promoFlag !== null && productResp.promoFlag !== ""){
                document.getElementById("promoFlagSection").style.display = "";
                var promoFlagLabel = document.getElementById("promoFlagLabel");
                if (promoFlagLabel){
                    promoFlagLabel.innerHTML = productResp.promoFlagLabel;
                }
            }
        },

        titleSection : function(productResp){
            if (productResp.baseName !== undefined && productResp.baseName !== null && productResp.baseName !== ""){
                $("#productName").text(productResp.baseName);
            }
            else{
                $("#productName").text(productResp.name);
            }

            ACC.productDetail.sizeChange.outOfStockNotificationSection(productResp);

            document.getElementById("launchProductInTitleSection").style.display = "none";
            if (productResp.productLaunchInfo !== undefined && productResp.productLaunchInfo !== null && productResp.productLaunchInfo !== ""){
                document.getElementById("launchProductInTitleSection").style.display = "";
            }
        },

        outOfStockNotificationSection : function(productResp){
            document.getElementById("outOfStockNotificationSection").style.display = "none";
            if ((productResp.productLaunchInfo === undefined || productResp.productLaunchInfo === null || productResp.productLaunchInfo === "") &&
                (productResp.productPreorderInfo === undefined || productResp.productPreorderInfo === null || productResp.productPreorderInfo === "" || !productResp.productPreorderInfo.presale) &&
                productResp.stock.stockLevelStatus.code === "outOfStock"){
                document.getElementById("outOfStockNotificationSection").style.display = "";
            }
        },

        priceInfoSection : function(productResp){

            document.getElementById("priceRangeSection").style.display = "none";

            document.getElementById("offTag").style.display = "none";
            document.getElementById("productDiscount").style.display = "none";
            document.getElementById("promotionDiscount").style.display = "none";
            document.getElementById("prodAndPromoDiscSpan1").style.display = "none";
            document.getElementById("highestPrice").style.display = "none";
            document.getElementById("previousPrice").style.display = "none";
            document.getElementById("currentPrice").style.display = "none";
            document.getElementById("priceBr").style.display = "none";

            document.getElementById("priceTableSection").style.display = "none";

            if (productResp.volumePrices === undefined || productResp.volumePrices === null){

                var isOrderForm = $("#isOrderForm").val();
                if ((productResp.priceRange !== undefined && productResp.priceRange !== null) &&
                    (productResp.priceRange.minPrice !== undefined && productResp.priceRange.minPrice !== null) &&
                    (productResp.priceRange.maxPrice !== undefined && productResp.priceRange.maxPrice !== null) &&
                    (productResp.priceRange.minPrice.value !== productResp.priceRange.maxPrice.value) &&
                    ((productResp.baseProduct === undefined || productResp.baseProduct === null) ||
                     (isOrderForm !== "" && isOrderForm !== undefined && isOrderForm !== null && isOrderForm === "true"))){

                     priceRangeSection.style.display = "";
                }
                else{

                    ACC.productDetail.sizeChange.productAndPromotionDiscountSection(productResp);
                }

            }
            else{

                ACC.productDetail.sizeChange.priceTableSection(productResp);
            }

        },

        productAndPromotionDiscountSection : function(productResp){

            if ((productResp.productDiscount !== undefined && productResp.productDiscount !== null && productResp.productDiscount !== "") &&
                (productResp.promotionDiscount === undefined || productResp.promotionDiscount === null || productResp.promotionDiscount === "")){

                document.getElementById("productDiscount").style.display = "";
            }

            if ((productResp.promotionDiscount !== undefined && productResp.promotionDiscount !== null && productResp.promotionDiscount !== "") &&
                (productResp.productDiscount === undefined || productResp.productDiscount === null || productResp.productDiscount === "")){

                document.getElementById("promotionDiscount").style.display = "";
            }

            var minDiscountValue = parseInt(document.getElementById("minDiscountValue").value);
            if ((productResp.promotionDiscount !== undefined && productResp.promotionDiscount !== null && productResp.promotionDiscount !== "") &&
                (productResp.productDiscount !== undefined && productResp.productDiscount !== null && productResp.productDiscount !== "") &&
                productResp.promotionDiscount > minDiscountValue && productResp.productDiscount > minDiscountValue){

                document.getElementById("prodAndPromoDiscSpan1").style.display = "";
                document.getElementById("prodAndPromoDiscSpan3").style.display = "";
            }

            var thereIsHighestPrice = false;
            var thereIsPreviousPrice = false;
            if (productResp.highestPrice !== undefined && productResp.highestPrice !== null && productResp.highestPrice !== "" &&
                productResp.productDiscount !== undefined && productResp.productDiscount !== null && productResp.productDiscount !== "" &&
                productResp.productDiscount > minDiscountValue){

                thereIsHighestPrice = true;
                document.getElementById("highestPrice").style.display = "";
            }

            if (productResp.previousPrice !== undefined && productResp.previousPrice !== null && productResp.previousPrice !== "" &&
                productResp.promotionDiscount !== undefined && productResp.promotionDiscount !== null && productResp.promotionDiscount !== "" &&
                productResp.promotionDiscount > minDiscountValue){

                thereIsPreviousPrice = true;
                document.getElementById("previousPrice").style.display = "";
            }

            var currentPriceElement = document.getElementById("currentPrice");
            if (currentPriceElement){

                var offTagElement = document.getElementById("offTag");
                if (thereIsHighestPrice || thereIsPreviousPrice){

                    if (!currentPriceElement.classList.contains("promo")){
                        currentPriceElement.classList.add("promo");
                    }

                    if (thereIsHighestPrice && thereIsPreviousPrice){
                        if (!offTagElement.classList.contains("duopromo-width")){
                            offTagElement.classList.add('duopromo-width');
                        }
                    }
                    else{
                        if (offTagElement.classList.contains("duopromo-width")){
                            offTagElement.classList.remove('duopromo-width');
                        }
                    }

                    offTagElement.style.display = "";
                }
                else{
                    if (currentPriceElement.classList.contains("promo")){
                        currentPriceElement.classList.remove("promo");
                    }
                }

                if (productResp.price){
                    document.getElementById("pdpCurrent_tagPrice").textContent = productResp.price.currencySymbol;
                    document.getElementById("pdpCurrent_wholePart").textContent = productResp.price.mainValue;
                    document.getElementById("pdpCurrent_decimalPart").textContent = productResp.price.decimalValue;
                    currentPriceElement.style.display = "";
                }

            }

            document.getElementById("priceBr").style.display = "";

        },

        priceTableSection : function(productResp){

            var currentBody = document.getElementById("priceTableSection");
            var newBody = document.createElement('tbody');

            productResp.volumePrices.forEach(function(volPrice){
                var row = newBody.insertRow(-1);
                var cell1 = row.insertCell(-1);
                var cell2 = row.insertCell(-1);

                var textForCell1 = "";
                if (volPrice.maxQuantity === undefined || volPrice.maxQuantity === null || volPrice.maxQuantity === ""){
                    textForCell1 = volPrice.minQuantity + "+";
                }
                else{
                    textForCell1 = volPrice.minQuantity + "-" + volPrice.maxQuantity;
                }

                cell1.innerText = textForCell1;
                cell2.innerText = volPrice.formattedValue;
            });

            currentBody.parentNode.replaceChild(newBbody, currentBody);
            document.getElementById("priceTableSection").style.display = "";

        },

        isDiscountGreater10 : function (previousPrice, price){
            var percentValue = price/previousPrice*100;
            if (percentValue > 10){
                return true;
            }
            else{
                return false;
            }
        },

        buyingToolInfoSection : function(productResp){
            ACC.productDetail.sizeChange.productSummarySection(productResp);
            ACC.productDetail.sizeChange.buyingButtonsSection(productResp);
        },

        productSummarySection : function(productResp){
            document.getElementById("presaleProductQuantitySection").style.display = "none";
            document.getElementById("presaleProductSizeSection").style.display = "none";
            document.getElementById("notPresaleProductSection").style.display = "none";
            document.getElementById("btNavSelectionsNotLaunchSection").style.display = "none";
            document.getElementById("btNavSelectionsLaunchSection").style.display = "none";

            if (productResp.productLaunchInfo === undefined || productResp.productLaunchInfo === null || productResp.productLaunchInfo === ""){

                document.getElementById("btNavSelectionsNotLaunchSection").style.display = "";

                if ((productResp.productPreorderInfo !== undefined && productResp.productPreorderInfo !== null && productResp.productPreorderInfo !== "" && productResp.productPreorderInfo.presale) ||
                    productResp.stock.stockLevelStatus.code !== 'outOfStock'){
                    document.getElementById("presaleProductQuantitySection").style.display = "";
                    document.getElementById("presaleProductSizeSection").style.display = "";
                }
                else{
                    document.getElementById("notPresaleProductSection").style.display = "";
                }
            }
            else{
                document.getElementById("btNavSelectionsLaunchSection").style.display = "none";
            }

            $("#selected-cantidad").text(1);
            $("#selected-size").text(productResp.size);
            $("#selected-size-outOfStock").text(productResp.size);
            document.getElementById("selected-color").style.backgroundImage = "url('/_ui/responsive/theme-innovasport/images/colores/" + productResp.colorCategory.toLowerCase() + ".jpg')";
        },

        buyingButtonsSection : function(productResp){
            document.getElementById("preorderInfoSection").style.display = "none";
            document.getElementById("notOutOfStockSection").style.display = "none";
            document.getElementById("notifyMeSection").style.display = "none";
            document.getElementById("outOfStockSection").style.display = "none";

            document.getElementById("preorderInfoSectionMobile").style.display = "none";
            document.getElementById("notOutOfStockSectionMobile").style.display = "none";
            document.getElementById("notifyMeSectionMobile").style.display = "none";
            document.getElementById("outOfStockSectionMobile").style.display = "none";

            var isPresale = (productResp.productPreorderInfo !== undefined && productResp.productPreorderInfo !== null &&
                productResp.productPreorderInfo !== "" && productResp.productPreorderInfo.presale);

            if (productResp.purchasable && isPresale){
                document.getElementById("preorderInfoSection").style.display = "";
                document.getElementById("preorderInfoSectionMobile").style.display = "";
            }
            if (productResp.purchasable && productResp.stock.stockLevelStatus.code !== "outOfStock" && !isPresale){
                document.getElementById("notOutOfStockSection").style.display = "";
                document.getElementById("notOutOfStockSectionMobile").style.display = "";
            }
            if (productResp.productLaunchInfo !== undefined && productResp.productLaunchInfo !== null && productResp.productLaunchInfo !== "" && !isPresale){
                document.getElementById("notifyMeSection").style.display = "";
                document.getElementById("notifyMeSectionMobile").style.display = "";
            }
            if (productResp.stock.stockLevelStatus.code === "outOfStock" && !isPresale){
                document.getElementById("outOfStockSection").style.display = "";
                document.getElementById("outOfStockSectionMobile").style.display = "";
            }
        },

        wishlistSection : function(productResp){

            var wishlistBtn = document.getElementById("wishlistBtn");
            if (wishlistBtn){
                wishlistBtn.setAttribute("data-product", productResp.code);

                if (productResp.inWishlist){
                    wishlistBtn.classList.add("inWishlist");
                }
                else{
                    wishlistBtn.classList.remove("inWishlist");
                }
            }

        },

        selectorsSection : function(productResp){
            document.getElementById("quantitySelectorSection").style.display = "none";
            document.getElementById("quantitySelectorSectionMobile").style.display = "none";
            document.getElementById("sizeSelectorSection").style.display = "none";
            document.getElementById("sizeSelectorSectionMobile").style.display = "none";

            if (productResp.productLaunchInfo === undefined || productResp.productLaunchInfo === null ||  productResp.productLaunchInfo === ""){

                if ((productResp.productPreorderInfo !== undefined && productResp.productPreorderInfo !== null && productResp.productPreorderInfo !== "" && productResp.productPreorderInfo.presale) ||
                    productResp.stock.stockLevelStatus.code !== 'outOfStock'){
                    document.getElementById("quantitySelectorSection").style.display = "";
                    document.getElementById("quantitySelectorSectionMobile").style.display = "";
                    ACC.productDetail.sizeChange.quantitySelectorSection(productResp);
                }

                document.getElementById("sizeSelectorSection").style.display = "";
                document.getElementById("sizeSelectorSectionMobile").style.display = "";
                ACC.productDetail.sizeChange.sizeSelectorSection(productResp);
            }
        },

        quantitySelectorSection : function(productResp){

            $("#is-quantitySelector__notice").text("");

            if ((productResp.stock.stockLevelStatus === undefined || productResp.stock.stockLevelStatus === null || productResp.stock.stockLevelStatus === "") ||
                (productResp.stock.stockLevelStatus.code === 'inStock' && (productResp.stock.stockLevel === undefined || productResp.stock.stockLevel === null || productResp.stock.stockLevel === ""))){
                $("#pdpAddtoCartInput").data("max", 10000);
                $("#pdpAddtoCartInputMobile").data("max", 10000);
            }
            else{
                $("#pdpAddtoCartInput").data("max", productResp.stock.stockLevel);
                $("#pdpAddtoCartInputMobile").data("max", productResp.stock.stockLevel);
            }

            document.getElementById("quantityButtonsAndInputSection").style.display = "none";
            document.getElementById("quantityButtonsAndInputSectionMobile").style.display = "none";
            if ((productResp.productPreorderInfo === undefined || productResp.productPreorderInfo === null || productResp.productPreorderInfo ==="") ||
                (productResp.productPreorderInfo !== undefined && productResp.productPreorderInfo !== null && productResp.productPreorderInfo !== "" && productResp.productPreorderInfo.presale)){
                document.getElementById("quantityButtonsAndInputSection").style.display = "";
                document.getElementById("quantityButtonsAndInputSectionMobile").style.display = "";
            }

            document.getElementById("preorderLaunchDateSection").style.display = "none";
            if (productResp.productPreorderInfo !== undefined && productResp.productPreorderInfo !== null && productResp.productPreorderInfo !== "" && productResp.productPreorderInfo.presale){
                document.getElementById("preorderLaunchDateSection").style.display = "";
            }

            document.getElementById("pdpAddtoCartInput").value = 1;
            document.getElementById("pdpAddtoCartInputMobile").value = 1;
            ACC.productDetail.checkMaxSelectableQty();
        },

        sizeSelectorSection : function(productResp){
            var inStockElements = document.getElementsByName("stockLevelStatusCodeToShowInStock");
            var lowStockElements = document.getElementsByName("stockLevelStatusCodeToShowLowStock");
            var outOfStockElements = document.getElementsByName("stockLevelStatusCodeToShowOutOfStock");

            inStockElements.forEach(function(element){ element.style.display = "none"; });
            lowStockElements.forEach(function(element){ element.style.display = "none"; });
            outOfStockElements.forEach(function(element){ element.style.display = "none"; });

            if (productResp.lowStockLimit >= productResp.stock.stockLevel && productResp.stock.stockLevel > 0){
                lowStockElements.forEach(function(element){ element.style.display = ""; });
            } else if (productResp.stock.stockLevelStatus.code === "inStock" || productResp.lowStockLimit < productResp.stock.stockLevel){
                inStockElements.forEach(function(element){ element.style.display = ""; });
            }else if (productResp.stock.stockLevelStatus.code === "outOfStock"){
                outOfStockElements.forEach(function(element){ element.style.display = ""; });
            }
        },

        personalizationSection : function(productResp, previousProductCode){
            var personalizationBtns = document.getElementsByName("personalizationBtn");
            if (personalizationBtns){
                personalizationBtns.forEach(function(btn){
                    if(btn.hasAttribute("onclick")){
                        var onclickAttribute = btn.getAttribute("onclick");
                        var newLinkForOnclick = onclickAttribute.split(previousProductCode).join(productResp.code);
                        btn.setAttribute("onclick", newLinkForOnclick);
                    }
                });
            }
        },

        colorWaysSection : function(productResp, primaryImage, localResources){

            var ul = document.getElementById("colorways_desktop_list");
            ul.innerHTML = "";

            if (productResp.grouping !== undefined && productResp.grouping !== null && productResp.grouping !== ""){

                for (var i = 0; i < productResp.grouping.length; i++){
                    var liContainer = productResp.grouping[i];

                    var li = ACC.productDetail.sizeChange.createGroupingLi(productResp, liContainer, i, localResources);
                    ul.appendChild(li);
                }

            }
            else{

                var li = ACC.productDetail.sizeChange.createSimpleLi(productResp, primaryImage, localResources);
                ul.appendChild(li);

            }

        },

        createGroupingLi : function(productResp, liContainer, counter, localResources){

            var li = document.createElement("li");
            li.setAttribute("class", "is-colorways__color ");
            li.setAttribute("data-id", counter);
            li.setAttribute("data-url", liContainer.url);

            var a = document.createElement("a");
            a.setAttribute("href", liContainer.url);

            var imageForLi = null;
            if (liContainer.images){
                imageForLi = liContainer.images.find(function(img){ return img.format === "product"; });
            }

            var img = ACC.productDetail.sizeChange.createProductColorImage(productResp, imageForLi);

            a.appendChild(img);
            li.appendChild(a);

            if (liContainer.productLaunchInfo === undefined || liContainer.productLaunchInfo === null || liContainer.productLaunchInfo === ""){
                var p1 = document.createElement("p");
                p1.setAttribute("class", "is-colorways__color__title");
                p1.innerHTML = liContainer.colorCategory.toLowerCase();

                var p2 = document.createElement("p");
                if (liContainer.availableStockGroup){
                    p2.setAttribute("class", "is-colorways__color__state ");
                    p2.innerHTML = localResources.stock_available;
                }
                else{
                    p2.setAttribute("class", "is-colorways__color__state noStock");
                    p2.innerHTML = localResources.stock_no_stock;
                }

                li.appendChild(p1);
                li.appendChild(p2);
            }

            return li;

        },

        createSimpleLi : function(productResp, primaryImage, localResources){

            var li = document.createElement("li");
            li.setAttribute("class", "is-colorways__color ");
            li.setAttribute("data-id", "");
            li.setAttribute("data-url", "");

            var img = ACC.productDetail.sizeChange.createProductColorImage(productResp, primaryImage);

            li.appendChild(img);

            if (productResp.productLaunchInfo === undefined || productResp.productLaunchInfo === null || productResp.productLaunchInfo === ""){
                var p1 = document.createElement("p");
                p1.setAttribute("class", "is-colorways__color__title");
                p1.innerHTML = productResp.colorCategory.toLowerCase();

                var p2 = document.createElement("p");
                if (productResp.lowStockLimit >= productResp.stock.stockLevel && productResp.stock.stockLevel > 0){
                    p2.setAttribute("class", "is-colorways__color__state lowStock");
                    p2.innerHTML = localResources.stock_low_stock;
                } else if (productResp.stock.stockLevelStatus.code === "inStock" || productResp.lowStockLimit < productResp.stock.stockLevel){
                    p2.setAttribute("class", "is-colorways__color__state ");
                    p2.innerHTML = localResources.stock_available;
                }else if (productResp.stock.stockLevelStatus.code === "outOfStock"){
                    p2.setAttribute("class", "is-colorways__color__state noStock");
                    p2.innerHTML = localResources.stock_no_stock;
                }

                li.appendChild(p1);
                li.appendChild(p2);
            }

            return li;

        },

        createProductColorImage : function(productResp, primaryImage){

            var img = document.createElement("img");
            if (primaryImage !== undefined && primaryImage !== null && primaryImage !== ""){

                if (primaryImage.altText !== undefined && primaryImage.altText !== null && primaryImage.altText !== ""){
                    img.setAttribute("src", primaryImage.url);
                    img.setAttribute("alt", primaryImage.altText);
                    img.setAttribute("title", primaryImage.altText);
                }
                else{
                    img.setAttribute("src", primaryImage.url);
                    img.setAttribute("alt", productResp.name);
                    img.setAttribute("title", productResp.name);
                }

            }
            else{
                img.setAttribute("src", "img.missingProductImage.responsive.product");
                img.setAttribute("alt", productResp.name);
                img.setAttribute("title", productResp.name);
            }

            return img;
        },

        metaTags : function(metaKeywords, metaDescription){
            var metas = document.getElementsByTagName('meta');
            for (var i = 0; i < metas.length; i++) {

                if (metas[i].getAttribute("name") === "keywords") {
                    metas[i].setAttribute("content", metaKeywords);
                }

                if (metas[i].getAttribute("name") === "description") {
                    metas[i].setAttribute("content", metaDescription);
                }
            }
        },

        utilsScripts : function(productResp, pageType, previousProductCode){

            ACC.productDetail.sizeChange.googleLinkedData(productResp, pageType);
            ACC.productDetail.sizeChange.googleTagManager(productResp, previousProductCode);
            ACC.productDetail.sizeChange.mapperTag(productResp, pageType, previousProductCode);

        },

        googleLinkedData : function(productResp, pageType){

            var googleLinkScript = document.getElementById("googleLinkScript");
            if (googleLinkScript !== undefined && googleLinkScript !== null && googleLinkScript !== ""){
                if (pageType === "PRODUCT"){
                    googleLinkScript.text = productResp.jsonLinkedData;
                }
            }

        },

        googleTagManager : function(productResp, previousProductCode){

            var googleTagManagerScript = document.getElementById("googleTagManagerScript");
            if (googleTagManagerScript !== undefined && googleTagManagerScript !== null && googleTagManagerScript !== ""){
                googleTagManagerScript.text = googleTagManagerScript.text.split(previousProductCode).join(productResp.code);
            }

        },

        mapperTag : function(productResp, pageType, previousProductCode){

            var mapperTagScript = document.getElementById("mapperTagScript");
            if (mapperTagScript !== undefined && mapperTagScript !== null && mapperTagScript !== ""){
                if (pageType === "PRODUCT"){
                    mapperTagScript.text = mapperTagScript.text.split(previousProductCode).join(productResp.code);
                }
            }

        },

        socialMediaSection : function(productResp){

            var shareByEmailBtn = document.getElementById("shareByEmailBtn");
            if (shareByEmailBtn){
                shareByEmailBtn.setAttribute("data-product-code", productResp.code);
            }
        },

        addToCartSection : function(productResp){

            if(productResp.purchasable){
                var qty = document.getElementById("qty");
                if (qty){
                    document.getElementById("qty").value = 1;
                }

                var addToCartProductCodePost = document.getElementById("addToCartProductCodePost");
                if (addToCartProductCodePost){
                    document.getElementById("addToCartProductCodePost").value = productResp.code;
                }
            }
        },

        storeFinderSection : function(productResp){
            var dataLocationService = "/store-pickup/" + productResp.code + "/pointOfServices";
            document.getElementById("pdpStoreFinderModalDiv").setAttribute("data-location-service", dataLocationService);
            document.getElementById("js-location-service").value = dataLocationService;

            var locationServiceSelectPos = "/store-pickup/" + productResp.code + "/selectPointOfService";
            document.getElementById("js-location-service-select-pos").value = locationServiceSelectPos;

            document.getElementById("storeFinderProductCodePost").value = productResp.code;
        },

        moreHiddenInputs : function(productResp){
            document.getElementById("stockNotificationProductCode").value = productResp.code;
            document.getElementById("variantProductCode").value = productResp.code;
        }

    },

	initPageEvents : function() {

		$('#toggle-event-tallas').change(function() {
			if ($(this).prop('checked') == false) {
				$('#centimeters-tables').hide();
				$('#inches-tables').show();
			} else {
				$('#inches-tables').hide();
				$('#centimeters-tables').show();
			}
		})

		$(document).on(
				"click",
				'.talla-mex-product',
				function() {

					var actual = $(this);
					if (!actual.hasClass('disabled')) {
						$('.talla-product > .tab-pane >  .active').removeClass(
								'active');
						actual.addClass('active');
						$('.talla-producto-compra').removeClass(
								'talla-usa-producto-compra');
						$('.talla-producto-compra').addClass(
								'talla-mex-producto-compra');
						$('.talla-producto-compra').val(actual.html());
					}

				})

		$(document).on(
				"click",
				'.talla-usa-product',
				function() {

					var actual = $(this);
					if (!actual.hasClass('disabled')) {
						$('.talla-product > .tab-pane > .active').removeClass(
								'active');
						actual.addClass('active');
						$('.talla-producto-compra').removeClass(
								'talla-mex-producto-compra');
						$('.talla-producto-compra').addClass(
								'talla-usa-producto-compra');
						$('.talla-producto-compra').val(actual.html());
					}

				})

		$(document).on("click", '.js-qty-selector .js-qty-selector-minus',
				function() {
					ACC.productDetail.checkQtySelector(this, "minus");
				})

		$(document).on("click", '.js-qty-selector .js-qty-selector-plus',
				function() {
					ACC.productDetail.checkQtySelector(this, "plus");
				})

		$(document).on("keydown", '.js-qty-selector .js-qty-selector-input',
		    function(e) {
		        if (($(this).val() != " " && ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)))
					|| e.which == 8
					|| e.which == 46
					|| e.which == 37
					|| e.which == 39
					|| e.which == 9) {
				} else if (e.which == 38) {
				    ACC.productDetail.checkQtySelector(this, "plus");
				} else if (e.which == 40) {
				    ACC.productDetail.checkQtySelector(this, "minus");
				} else {
				    e.preventDefault();
				}
		})

		$(document).on("keyup", '.js-qty-selector .js-qty-selector-input',
				function(e) {
					ACC.productDetail.checkQtySelector(this, "input");
					//ACC.productDetail.updateQtyValue(this, $(this).val());
				})

		$(document).on("focusout", '.js-qty-selector .js-qty-selector-input',
		function(e) {
			ACC.productDetail.checkQtySelector(this, "focusout");
			ACC.productDetail.updateQtyValue(this, $(this).val());
		})

        $(document).on("click", ".js-show-more-reviews-toggle", function(e) {
            e.preventDefault();

            var reviewCounter = parseInt($("#reviewCounter").val());
            var reviewVisibleAt = parseInt($("#reviewVisibleAt").val());
            var reviewVisibleTo = reviewVisibleAt + 2;

            for (var i = reviewVisibleAt; i < reviewVisibleTo; i++){
                $(".js-show-reviews-" + i).show();
            }

            $("#reviewVisibleAt").val(reviewVisibleTo);

            if (reviewVisibleTo >= reviewCounter){
                $(".js-show-more-reviews-toggle").hide();
                $(".js-show-firsts-reviews-toggle").show();
            }
        });

        $(document).on("click", ".js-show-firsts-reviews-toggle", function(e) {
            e.preventDefault();

            var showFromBeginning = parseInt($("#showFromBeginning").val());
            var reviewCounter = parseInt($("#reviewCounter").val());

            $("#reviewVisibleAt").val(showFromBeginning);

            for (var i = 0; i <= reviewCounter; i++){
                if (i >= showFromBeginning){
                    $(".js-show-reviews-" + i).hide();
                }
            }

            $(".js-show-firsts-reviews-toggle").hide();
            $(".js-show-more-reviews-toggle").show();
        });

		$("#Size").change(function() {
			changeOnVariantOptionSelection($("#Size option:selected"));
		});

		$("#variant").change(function() {
			changeOnVariantOptionSelection($("#variant option:selected"));
		});

		$(".selectPriority").change(function() {
			window.location.href = $(this[this.selectedIndex]).val();
		});

		function changeOnVariantOptionSelection(optionSelected) {
			window.location.href = optionSelected.attr('value');
		}

		if (jQuery('body.page-productDetails').length) {
			setTimeout(function() {
				jQuery("html").scrollTop(0);

			}, 1000);
		}

        $(document).on("keyup", "#review-headline", ACC.productDetail.manageReview.onReviewRequiredFieldsChanged);
        $(document).on("keyup", "#review-comment", ACC.productDetail.manageReview.onReviewRequiredFieldsChanged);
        $(document).on("change", "input[type=radio][name=rating]", ACC.productDetail.manageReview.onReviewRequiredFieldsChanged);
	},

	bindVariantOptions : function() {
		ACC.productDetail.bindCurrentStyle();
		ACC.productDetail.bindCurrentSize();
		ACC.productDetail.bindCurrentType();
	},

	bindCurrentStyle : function() {
		var currentStyle = $("#currentStyleValue").data("styleValue");
		var styleSpan = $(".styleName");
		if (currentStyle != null) {
			styleSpan.text(": " + currentStyle);
		}
	},

	bindCurrentSize : function() {
		var currentSize = $("#currentSizeValue").data("sizeValue");
		var sizeSpan = $(".sizeName");
		if (currentSize != null) {
			sizeSpan.text(": " + currentSize);
		}
	},

	bindCurrentType : function() {
		var currentSize = $("#currentTypeValue").data("typeValue");
		var sizeSpan = $(".typeName");
		if (currentSize != null) {
			sizeSpan.text(": " + currentSize);
		}
	},

	bindPersonalizeTeam : function() {
		$(document).on(
				"change",
				'#player_selector',
				function() {

					if ($("#player_selector option:selected").text()) {
						var array = $("#player_selector option:selected")
								.text().trim().split("-");
						if (array && array.length == 2) {
							var playerName = $("#player_name").val();
							var playerNumber = $("#player_number").val();

							$("#" + playerName).val(array[1].trim());
							$("#" + playerNumber).val(array[0].trim());
							// $("#${configurations[0].configuratorType}_${configurations[0].configurationLabel}").val(array[1].trim());
							// $("#${configurations[1].configuratorType}_${configurations[1].configurationLabel}").val(array[0].trim());
						}

					}
				});
	},

	validateEmail: function () {
		$(document).on("keyup", '#notifySizeEmail', function() {
			var email = $("#notifySizeEmail").val();
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(re.test(String(email).toLowerCase())){
				$("#stockNotificationSubmit").attr('disabled', false);
			}
		})
	},

	submitRestockNotification: function () {

		$(document).on("click", '#stockNotificationSubmit', function() {

		    ACC.productDetail.loader.openColorBox();

			var notifySizeEmail = $("#notifySizeEmail").val();
			var notifySizeNewsletter = false;

			if(document.getElementById("notifySizeNewsletter").checked == true){
				notifySizeNewsletter = true;
			}

			var emailNotificationEnabled = true;
			var dataString = 'emailAddress='+ notifySizeEmail + '&emailNotificationEnabled=' + emailNotificationEnabled +
			    '&subscribeToEmarsysNewsLetter=' + notifySizeNewsletter;

			var stockNotificationProductCode = $("#stockNotificationProductCode").val();
			$.ajax({
			    url: "/p/" + stockNotificationProductCode + "/add-stock-notification",
			    type: 'POST',
			    async: true,
			    data: dataString,
			    success: function (response)
			    {
			        if(response === "success"){
			            document.getElementById("currentUser").innerHTML = notifySizeEmail;
			            var reminder = document.getElementById("reminder");
			            reminder.classList.remove("open");
			            var waiting = document.getElementById("waiting");
			            waiting.classList.remove("open");
			            var success = document.getElementById("success");
			            success.classList.add("open");
                    }
                    else if(response === "error"){
                        var reminder = document.getElementById("reminder");
                        reminder.classList.remove("open");
                        var waiting = document.getElementById("waiting");
                        waiting.classList.remove("open");
                        var error = document.getElementById("error");
                        error.classList.add("open");
                    }

                    ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal();
                },
                error: function (response){
                    var reminder = document.getElementById("reminder");
                    reminder.classList.remove("open");
                    var waiting = document.getElementById("waiting");
                    waiting.classList.remove("open");
                    var error = document.getElementById("error");
                    error.classList.add("open");
                    ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal();
                }
           });
		});
	},

	loadGBModel : function(){
		var gbPDataModel = $('#gb_product_model').val();
		var gbAccordion = $('.is-gb .is-accordion__item-wrapper.is-accordion__item-html:eq(0)');

		if(gbAccordion.text().search(gbPDataModel)==-1){
			var ul = gbAccordion.find('ul');
			if(ul.length){
				ul.prepend("<li>Estilo "+gbPDataModel+"</li>")
			}else{
				gbAccordion.prepend("<ul><li>Estilo "+gbPDataModel+"</li></ul>")
			}
		}
	},

	writeReview : function(){

	    ACC.productDetail.loader.openColorBox();

        var baseProductCode = $("#baseProductCode").val();

        var headline = document.getElementById("review-headline").value;
        var comment = document.getElementById("review-comment").value;
        var rating = parseInt($("input[type=radio][name=rating]:checked").val());
        var alias = document.getElementById("review-alias").value;
        var qualityLevel = parseInt($("input[type=radio][name=quality]:checked").val());

        var form = JSON.stringify({
            headline: headline,
            comment: comment,
            rating: rating,
            alias: alias,
            qualityLevel: qualityLevel
        });

	    $.ajax({
            url: "/p/" + baseProductCode + "/writeReview",
            type: 'POST',
            data: form,
            contentType: "application/json",
            success: function (reviewResp)
            {
                var reviewRespObj = JSON.parse(reviewResp);
                ACC.productDetail.manageReview.resetFormFields();
                ACC.productDetail.manageReview.removePreviousAlertsMessages();
                ACC.productDetail.manageReview.checkArrayAndAppendChild(reviewRespObj.accConfMsgs, "alertConfSection");
                ACC.productDetail.manageReview.checkArrayAndAppendChild(reviewRespObj.accInfoMsgs, "alertInfoSection");
                ACC.productDetail.manageReview.checkArrayAndAppendChild(reviewRespObj.accErrorMsgs, "alertErrorSection");

                $("html, body").animate({
                    scrollTop: 0
                }, 500);

                ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal();

            },
            error: function (reviewResp){
                console.log(reviewResp);
                ACC.productDetail.loader.closeColorBoxAndReopenBuyingToolModal();
            }
        });
	},

    dialogWriteReview : function() {
        $("#reviewModal").modal("hide");
        ACC.productDetail.writeReview();
    },

	toggleReviewLike(reviewId) {
	    var userLikeElem = document.getElementById(reviewId + "-user-like");
	    var url = "/p/likes/" + (userLikeElem.classList.contains("active") ? "remove" : "add") + "/" + reviewId;

	    $.ajax({
            url: url,
            type: 'POST',
            success: function (newLikesCount) {
                ACC.productDetail.manageReview.refreshLikes(reviewId, newLikesCount);
            },
            error: function (reviewResp){
                console.log(reviewResp);
            }
        });
	},

	manageReview : {

	    resetFormFields : function(){
            $("input[type=radio][name=rating]:checked").removeAttr('checked').blur();
            $("input[type=radio][name=quality]:checked").removeAttr('checked').blur();
            document.getElementById("review-alias").value = "";
            document.getElementById("review-headline").value = "";
            document.getElementById("review-comment").value ="";
            document.getElementById("globalAlertsSection").style.display = "";
	    },

	    removePreviousAlertsMessages : function(){

            var ratingReviewMessageDivs = document.getElementsByName("ratingReviewMessageDiv");
            for (var i = ratingReviewMessageDivs.length - 1; i >= 0 ; i--) {
                var msgDiv = ratingReviewMessageDivs[i];
                msgDiv.parentNode.removeChild(msgDiv);
            }

        },

        checkArrayAndAppendChild : function(msgArray, alertSectionId){

            if (msgArray !== undefined && msgArray !== null && msgArray !== []){
                var alertSection = document.getElementById(alertSectionId);
                for (var i = 0; i < msgArray.length; i++) {
                  var node = ACC.productDetail.manageReview.duplicateNode(alertSection, msgArray[i].msg, i);
                  alertSection.parentNode.appendChild(node);
                }
            }

        },

        duplicateNode : function(sourceNode, msg, counter) {

            var clonedAlert = sourceNode.cloneNode(true);
            clonedAlert.id = clonedAlert.id + "_" + counter;
            clonedAlert.setAttribute("name", "ratingReviewMessageDiv");
            clonedAlert.style.display = "";

            var allSpans = clonedAlert.getElementsByTagName("span");
            for (var i = 0, len1 = allSpans.length; i < len1; i++) {
                var span = allSpans[i];
                span.textContent = msg;
            }

            return clonedAlert;
        },

        refreshLikes : function(reviewId, newLikesCount) {
            var userLikeElem = document.getElementById(reviewId + "-user-like");
            var likesElem = document.getElementById(reviewId + "-likes");
            var likeIcon = userLikeElem.firstElementChild;

            userLikeElem.classList.toggle("active");
            if (userLikeElem.classList.contains("active")) {
                likeIcon.classList.remove("fa-thumbs-o-up");
                likeIcon.classList.add("fa-thumbs-up")
            } else {
                likeIcon.classList.remove("fa-thumbs-up");
                likeIcon.classList.add("fa-thumbs-o-up")
            }

            likesElem.innerHTML = newLikesCount;
        },

        onReviewRequiredFieldsChanged : function() {
            var dialogReviewSubmit = document.getElementById("dialog-review-submit");
            if (dialogReviewSubmit) {
                var headline = document.getElementById("review-headline").value;
                var comment = document.getElementById("review-comment").value;
                var rating = parseInt($("input[type=radio][name=rating]:checked").val());

                if (headline && comment && rating) {
                    dialogReviewSubmit.classList.remove("disabled");
                } else {
                    dialogReviewSubmit.classList.add("disabled");
                }
            }
        }
	},

	loader : {

	    openColorBox : function(){
	        ACC.colorbox.showLoader();
	        return !$("#buyingToolsModal").hasClass("closed");
	    },

	    closeColorBoxAndReopenBuyingToolModal : function(reopenBuyingTool){

            ACC.colorbox.close();
            if (reopenBuyingTool){
                setTimeout(function() {
                    $("#buyingToolsNav").addClass("is-modal-opened");
                    $("#buyingToolsModal").removeClass("closed");
                }, 100);
            }
	    }

	}

};
