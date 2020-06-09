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
ACC.checkoutpayments = {

    _autoload: [
        "bindPaymentOptions"
    ],
    
    bindPaymentOptions: function(){
		$('#paymentSelect .label-method-payments, .checkout-bottom-border .clearfix label').click(function(e){
		
			var __this=$(this).prev('input');
			__this.click();
			
		});

		$("input[class=payment_method]").change(function() {
				
				if ($(this).val() == "BANKTRANSFER") {
					$('#creditCardPay').hide();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
				if ($(this).val() == "REFERINNOVASPORT") {
					$('#creditCardPay').hide();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
				if ($(this).val() == "OXXO") {
					$('#creditCardPay').hide();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
				if ($(this).val() == "OXXOPAY") {
					$('#creditCardPay').hide();
					$('#billingForm').show();
					$('#diferentAddress').show();
					$('#save_payment_details').show();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
				if ($(this).val() == "BANAMEX") {
					$('#creditCardPay').hide();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
				if ($(this).val() == "BANORTE7ELEVENTELECOM") {
					$('#creditCardPay').hide();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
				if ($(this).val() == "paypal") {
					$('#creditCardPay').hide();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
				if ($(this).val() == "paypalplus") {
					ACC.checkoutpayments.checkIfIframeIsVisible();
				}else {
					ACC.checkoutpayments.updateCartTotals($(this).val());
				}
				if($(this).val() == "adyen") {
					$('#creditCardPay').show();
					$('#ppplus').hide();
					$('#ppplusdata').hide();
				}
			});
		
			$("#ppplusdata > .div_select_ppplus > input").change(function() {
				var selectedPPP = $("#payment_method_paypalplus");
				var tokenUrl = selectedPPP.data("paypalplus-token-url");
				var paypalName = selectedPPP.data("paypalplus-first-name");
				var paypallastName = selectedPPP.data("paypalplus-last-name");
				var paypalemail = selectedPPP.data("paypalplus-email");
				var paypaltlfn = selectedPPP.data("paypalplus-phone");
				var rememberedCards = selectedPPP.data("paypalplus-rmb-cards");
				var paypalSandboxMode = selectedPPP.data("paypalplus-snd-bx");
				var approvalUrl = document.appUrl; //$("#accessToken:first").val();

				if(!isNaN(paypaltlfn)){
					paypaltlfn = paypaltlfn.toString();
				}

				if((approvalUrl !== undefined) && (approvalUrl !== "")){
					var meses = $(this).val();	    
					if(parseInt(meses)==parseInt(18)){
						ppp = PAYPAL.apps.PPP({
							"approvalUrl": approvalUrl,
							"placeholder": "ppplus",
							"payerFirstName": paypalName,
							"payerLastName": paypallastName,
							"payerEmail": paypalemail,
							"payerPhone": paypaltlfn,
							"payerTaxId":"",
							"merchantInstallmentSelection":parseInt(12),
							"buttonLocation": "outside",
							"enableContinue": "continueButton",
							"disableContinue": "continueButton",
							"rememberedCards": rememberedCards,
							"language":"es_MX",
							"country":"MX",
							"merchantInstallmentSelectionOptional":true,
							"mode": paypalSandboxMode,
							"collectBillingAddress":true});
					} else {
						ppp = PAYPAL.apps.PPP({
							"approvalUrl": approvalUrl,
							"placeholder": "ppplus",
							"payerFirstName": paypalName,
							"payerLastName": paypallastName,
							"payerEmail": paypalemail,
							"payerPhone": paypaltlfn,
							"payerTaxId":"",
							"merchantInstallmentSelection":parseInt(meses),
							"buttonLocation": "outside",
							"enableContinue": "continueButton",
							"disableContinue": "continueButton",
							"rememberedCards": rememberedCards,
							"language":"es_MX",
							"country":"MX",
							"mode": paypalSandboxMode,
							"collectBillingAddress":true});
					}
				}
			});
		},

		updateCartTotals: function(paymentMethodSelection, cardBin) {
		    var data = cardBin ? {paymentMethodSelection: paymentMethodSelection, cardBin: cardBin} :
		        {paymentMethodSelection: paymentMethodSelection};

			$.ajax({
				url: "/checkout/multi/payment-method/update-cart",
				type: "post",
				data: data,
				success: function (response)
				{	
					document.totalAmount = response;
					ACC.checkoutpayments.updateSummary();
				}
			});
		},

		updateSummary: function() {
			$.ajax({
				url: "/checkout/multi/payment-method/add",
				type: "get",
				success: function (response)
				{	
					var newOrderSummary = $(response).find("div.checkout-order-summary").first().html();
					$("div.checkout-order-summary").first().html(newOrderSummary);
				}
			});
		},

		checkIfIframeIsVisible: function(){
			
			if ($("#payment_method_paypalplus").is(":checked")){	
				$('#creditCardPay').hide();
				$('#ppplus').show();
				
				$("#ppplusdata > .div_select_ppplus:first > input").trigger( "click" ); 
		    	var selectedPPP = $("#payment_method_paypalplus");
				var tokenUrl = selectedPPP.data("paypalplus-token-url");
				var paypalName = selectedPPP.data("paypalplus-first-name");
				var paypallastName = selectedPPP.data("paypalplus-last-name");
				var paypalemail = selectedPPP.data("paypalplus-email");
				var paypaltlfn = selectedPPP.data("paypalplus-phone");
				var rememberedCards = selectedPPP.data("paypalplus-rmb-cards");
				var paypalSandboxMode = selectedPPP.data("paypalplus-snd-bx");
				
				if(!isNaN(paypaltlfn)){
					paypaltlfn = paypaltlfn.toString();
				}
						    	
				$.ajax({
					url: tokenUrl,
					type: "post",
					success: function (response)
					{	
						if(response.showNoInterestOptions == true){
							$('#ppplusdata').show();
						}
						
						ACC.checkoutpayments.updateSummary();
						
						document.appUrl = response.approvalUrl;
						document.paymentDetailsForm.payId.value = response.payId;
						
					    ppp = PAYPAL.apps.PPP({
					       	"approvalUrl": response.approvalUrl,
					       	"placeholder": "ppplus",
					       	"payerFirstName": paypalName,
					       	"payerLastName": paypallastName,
					       	"payerEmail": paypalemail,
					       	"payerPhone": paypaltlfn,
					       	"payerTaxId":"",
					       	"merchantInstallmentSelection":1,
					       	"buttonLocation": "outside",
					       	"enableContinue": "continueButton",
			        		"disableContinue": "continueButton",
			        		"rememberedCards": rememberedCards,
					       	"language":"es_MX",
					       	"country":"MX",
					       	"mode": paypalSandboxMode,
					       	"collectBillingAddress":true});
					}
				});
			 }
		}
}

