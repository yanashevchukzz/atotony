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
ACC.checkout = {

	_autoload: [
		"bindCheckO",
		"bindForms",
		"bindSavedPayments",
		"bindSelectState",
		"bindSelectPOS",
		"checkoutDatosEnvioRadioBtns",
		"appendAddressOptions",
		"bindSelectUserAddress",
		"bindSelectDeliveryAddress",
		"checkIfShowIframe",
		"bindDefaultPosAddress"
	],

	bindDefaultPosAddress : function(){
		if($("#instorepickup_state_select").val() != undefined && $("#instorepickup_sucursal_select").val() != undefined && $("#instorepickup_store_select").val() != undefined
				&& $("#instorepickup_state_select").val() != "" && $("#instorepickup_sucursal_select").val() != "" && $("#instorepickup_store_select").val() != ""){

			var homeTab = $("#home-tab").parent();
			var scursalTab = $("#sucursal-tab").parent();
			if($(homeTab).hasClass("active")){
				$(homeTab).removeClass("active");
				$(scursalTab).addClass("active");

				$("#myTabContent #home").removeClass("active in");
				$("#myTabContent #sucursal").addClass("active in");
			}

			$("#regionSelected").val($('#instorepickup_state_select').val());
			$("#sucursalSelected").val($('#instorepickup_sucursal_select').val());
			$("#storeSelected").val($("#instorepickup_store_select").val());

			if($('#instorepickup_state_select').hasClass("empty")){
				$('#instorepickup_state_select').removeClass("empty");
				$('#instorepickup_state_select').addClass("valid");
			}
			if($('#instorepickup_sucursal_select').hasClass("empty")){
				$('#instorepickup_sucursal_select').removeClass("empty");
				$('#instorepickup_sucursal_select').addClass("valid");
			}
			if($("#instorepickup_store_select").hasClass("empty")){
				$("#instorepickup_store_select").removeClass("empty");
				$("#instorepickup_store_select").addClass("valid");
			}
		}
	},
	
	checkIfShowIframe : function (){
		ACC.checkoutpayments.checkIfIframeIsVisible();
	  },
	    
	bindForms:function(){

		$(document).on("click","#addressSubmit",function(e){
			e.preventDefault();
			$('#addressForm').submit();	
		})
		
		$(document).on("click","#multiFormSubmit",function(e){
			e.preventDefault();
			$('#multiForm').submit();	
		})
		
		
		$(document).on("keyup change","#clickAndCollectForm input",function(e){
			var input=$(this);
			if($.trim(input.val())==""){
				input.addClass('invalid');
				input.removeClass('valid');
				input.removeClass('empty');
				isValid();
				
			}else{
				input.addClass('valid');
				input.removeClass('invalid');
				input.removeClass('empty');
				isValid();
			}
			
		})
				$(document).on("change","#clickAndCollectForm select",function(e){
					var select=$(this);
					
					if(select.val()==""){
						select.addClass('invalid');
						select.removeClass('valid');
						select.removeClass('empty');
						isValid();
						
					}else{
						select.addClass('valid');
						select.removeClass('invalid');
						select.removeClass('empty');
						isValid();
					}
					
				})
			function isValid(){
			var isDisabled=false;
			if($("#clickAndCollectForm input.invalid").length > 0 || $("#clickAndCollectForm input.empty").length > 0 || $("#clickAndCollectForm select.invalid").length > 0 || $("#clickAndCollectForm select.empty").length > 0){
				isDisabled=true;
				$("#collectSubmit").attr('disabled', true);
			}
			
			if(isDisabled==false){
				$("#collectSubmit").attr('disabled', false);
			}
			if($("#instorepickup_state_select").val() =="" || $("#instorepickup_sucursal_select").val() =="" || $("#instorepickup_store_select").val() =="" 
				|| $('#clickAndCollectForm :input').get(6).value == "" || $('#clickAndCollectForm :input').get(7).value == "" || $("#sucursalSelected").val() == "" || $("#regionSelected").val() == "" || $("#storeSelected").val() == ""  ){
				isDisabled=true;
				$("#collectSubmit").attr('disabled', true);
			}
		}
		$(document).on("click","#collectSubmit",function(e){
			e.preventDefault();
			var formulario=$('#clickAndCollectForm');
			
				formulario.submit();	
			
			
		})
		
		$(document).on("click","#deliveryMethodSubmit",function(e){
			e.preventDefault();
			$('#selectDeliveryMethodForm').submit();	
		})

	},

	bindSavedPayments:function(){
		$(document).on("click",".js-saved-payments",function(e){
			e.preventDefault();

			var title = $("#savedpaymentstitle").html();

			$.colorbox({
				href: "#savedpaymentsbody",
				inline:true,
				maxWidth:"100%",
				opacity:0.7,
				// width:"320px",
				title: title,
				close:'<span class="glyphicon glyphicon-remove"></span>',
				onComplete: function(){
				}
			});
		});
	},

	bindCheckO: function ()
	{
		var cartEntriesError = false;
		
		// Alternative checkout flows options
		$('.doFlowSelectedChange').change(function ()
		{
			if ('multistep-pci' == $('#selectAltCheckoutFlow').attr('value'))
			{
				$('#selectPciOption').css('display', '');
			}
			else
			{
				$('#selectPciOption').css('display', 'none');

			}
		});



		$('.js-continue-shopping-button').click(function ()
		{
			var checkoutUrl = $(this).data("continueShoppingUrl");
			window.location = checkoutUrl;
		});

		
		$('.expressCheckoutButton').click(function()
				{
					document.getElementById("expressCheckoutCheckbox").checked = true;
		});
		
//		$(document).on("input",".confirmGuestEmail,.guestEmail",function(){
//			  
//			  var orginalEmail = $(".guestEmail").val();
//			  var confirmationEmail = $(".confirmGuestEmail").val();
//			  
//			  if(orginalEmail === confirmationEmail){
//			    $(".guestCheckoutBtn").removeAttr("disabled");
//			  }else{
//			     $(".guestCheckoutBtn").attr("disabled","disabled");
//			  }
//		});


		$(document).on("input","#guest\\.email,#guest\\.confirm\\.email",function(){
		  
		  var orginalEmail = $("#guest\\.email").val();
		  var confirmationEmail = $("#guest\\.confirm\\.email").val();
		  
		  if(orginalEmail === confirmationEmail){
		    $(".guestCheckoutBtn").removeAttr("disabled");
		  }else{
		     $(".guestCheckoutBtn").attr("disabled","disabled");
		  }
	});

		
		
		$(document).on("click", ".js-continue-checkout-button", function()
		{
			var checkoutUrl = $(this).data("checkoutUrl");
			
			cartEntriesError = ACC.pickupinstore.validatePickupinStoreCartEntires();
			if (!cartEntriesError)
			{
				var expressCheckoutObject = $('.express-checkout-checkbox');
				if(expressCheckoutObject.is(":checked"))
				{
					window.location = expressCheckoutObject.data("expressCheckoutUrl");
				}
				else
				{
					var flow = $('#selectAltCheckoutFlow').attr('value');
					if ( flow == undefined || flow == '')
					{
						// No alternate flow specified, fallback to default
						// behaviour
						window.location = checkoutUrl;
					}
					else
					{
						// Fix multistep-pci flow
						if ('multistep-pci' == flow)
						{
						flow = 'multistep';
						}
						var pci = $('#selectPciOption').attr('value');

						// Build up the redirect URL
						var redirectUrl = checkoutUrl + '/select-flow?flow=' + flow + '&pci=' + pci;
						window.location = redirectUrl;
					}
				}
			}
			return false;
		});

	},
	
	bindSelectState:function(){
		
		$('#instorepickup_state_select').change(function(){
		
			$("#regionSelected").val($(this).val());
			$('#instorepickup-address-area').empty();
			
			$("#storeSelected").val("");
			$("#sucursalSelected").val("");

			if($("#regionSelected").val() == "" || $("#storeSelected").val() == "" || $("#sucursalSelected").val() == ""){
				isDisabled=true;
				$("#collectSubmit").attr('disabled', true);
			}
			
			
			$.ajax({
				url: $(this).data('url'),
				data: {region: $(this).val()},
				type: "get",
				beforeSend: function ()
				{
					$("#spinner_posType").html(ACC.address.spinner);
				},
				success: function (response)
				{	$("#spinner_posType").html("");
					ACC.checkout.appendPosTypeOptions(response);
					$("#instorepickup_store_select").empty();
					$('#instorepickup_store_select').append($('<option>', { 
				        value: "",
				        text : "Seleccionar..." 
				        
				    }));
				}
			});
		});
	},
	
	appendPosTypeOptions: function (data){
			
			$('#instorepickup_sucursal_select').empty();
			$('#instorepickup_sucursal_select').append($('<option>', { 
			        value: "",
			        text : "Seleccionar..." 
			        
			    }));
			 
			$.each(data, function (i, item) {
				$('#instorepickup_sucursal_select').append($('<option>', { 
			        value: item,
			        text : item 
			    }));
			});

		},
	
	bindSelectPOS:function(){
			
			$('#instorepickup_sucursal_select').change(function(){
			
				$("#regionSelected").val($('#instorepickup_state_select').val());
				if($("#sucursalSelected").val() == "" || $('#instorepickup_store_select').val()== ""){
					$("#sucursalSelected").val($(this).val());
				}
				else {
					$("#sucursalSelected").val("");
				}
				$("#storeSelected").val("");
				
				if($("#regionSelected").val() == "" || $("#storeSelected").val() == "" || $("#sucursalSelected").val() == ""){
					isDisabled=true;
					$("#collectSubmit").attr('disabled', true);
				}
				
				$('#instorepickup-address-area').empty();
				
				if($("#instorepickup_state_select").val() !="" && $("#instorepickup_sucursal_select").val() =="" ){
					$('#instorepickup_store_select').empty();
					$('#instorepickup_store_select').append($('<option>', { 
					        value: "",
					        text : "Seleccionar..." 
					        
					    }));
					return;
				}
				
				$.ajax({
					url: $(this).data('url'),
					data: {region: $('#instorepickup_state_select').val(), posEnumType: $(this).val()},
					type: "get",
					beforeSend: function ()
					{
						$("#spinner_store").html(ACC.address.spinner);
					},
					success: function (response)
					{	$("#spinner_store").html("");
						ACC.checkout.appendStoreOptions(response);
					}
				});
			});
		},

	appendStoreOptions: function (data){
		
		$('#instorepickup_store_select').empty();
		$('#instorepickup_store_select').append($('<option>', { 
		        value: "",
		        text : "Seleccionar..." 
		        
		    }));
		 
		$.each(data, function (i, item) {
			$('#instorepickup_store_select').append($('<option>', { 
		        value: item.name,
		        text : item.displayName 
		    }));
		});
		
		ACC.checkout.bindSelectStore(data);

	},
	
	bindSelectStore : function(stores){
		
		
		$(document).on("change", '#instorepickup_store_select', {updatedStores: stores}, function(event){
			event.preventDefault();
			
			
			$('#instorepickup-address-area').empty();
			$("#instorepickup-spinner").show();
			
			
			var store = ACC.checkout.findStore($(this).val(), event.data.updatedStores);
			if(store && store.length > 0){
				var address = store[0].address;
				console.log(address);
				
				var baseURL = $('#instorepickup-address-area').data("storelocateurl");
				var storeURL = baseURL+'?store='+$(this).val();
				
				if(address){
					var addressHTML = '<address><strong>'+store[0].displayName+' #'+$(this).val()+'</strong>';
					addressHTML += '<br>'+address.line1;
					if(address.numExterno != null ) { 
						addressHTML += ' #'+address.numExterno;
					}
					if(address.numInterno!= null){
						addressHTML += ' '+address.numInterno;
					}
					addressHTML += '<br>'+address.colonia;
					addressHTML += '<br>'+address.town+' '+address.region.name+' '+address.postalCode+' '+address.region.countryIso;
					if (address.phone != null ){
						addressHTML += '<br>' +address.phone;
					}
					addressHTML +='</address>';
					
					$('#instorepickup-address-area').html(addressHTML);
				}
			}
			$("#instorepickup-spinner").hide();


			
			
			$("#regionSelected").val($('#instorepickup_state_select').val());
			$("#sucursalSelected").val($('#instorepickup_sucursal_select').val());
			$("#storeSelected").val($(this).val());
			
			if($("#regionSelected").val() == "" || $("#storeSelected").val() == "" || $("#sucursalSelected").val() == ""){
				isDisabled=true;
				$("#collectSubmit").attr('disabled', true);
				return
			}
			else if($('#clickAndCollectForm :input').get(6).value != "" && $('#clickAndCollectForm :input').get(7).value != ""){
				isDisabled=false;
				$("#collectSubmit").attr('disabled', false);
				return
			}
			
		});

		
	},
		
	findStore: function(storeName, data){
	    return $.grep(data, function(n, i){
	      return n.name == storeName;
	    });
	},
	selectAddress : function(id, divId){
		
		if($("#"+id+ " :selected").length > 0 ){	//Si la vista contiene el elemento se intenta ejecutar
		var prefixForm = $("#"+id).data("prefix");
		
		if($("#"+id).val() == "")
		{
			ACC.checkout.resetAddressForm(prefixForm);
			$("#"+divId).show();
			$("#"+id+"-selectedarea").hide();
			$("#"+id+"-saveInAddressBook").show();
			
			
		}else{
		
			$("#"+divId).hide();
				var address = $("#"+id+ " :selected").data();
				//Objeto data del jsp, no se corresponde con los campos de la direccion si no con los data de las option
				var addressHTML = "<address><strong>"+address.displayname+": "+address.firstname+" "+address.lastname+"</strong>";
				addressHTML += "<br>"+address.line1+" "+address.numexterno+" "+address.numinterno;
				addressHTML += "<br>"+address.colonia;
				addressHTML += "<br>"+address.town+" "+address.region+" "+address.postalcode+" "+address.country;
				addressHTML += "<br>"+address.phone+"</address>";
				
				$("#"+id+"-selectedarea").html(addressHTML);
				$("#"+id+"-selectedarea").show();
				$("#"+id+"-saveInAddressBook").hide();
				
				//Importante para el envio del formulario con el valor seleccionado
				$("#"+prefixForm+"_addressId").val($("#"+id+ " :selected").val());
	
			}
		}
		},
	appendAddressOptions: function (data){
			
			
			$('#user_address_book').append($('<option>', { 
			        value: "",
			        text : "Añadir nueva dirección..." 
			        
			    }));
			
			ACC.checkout.selectAddress("user_address_book", "i18nAddressForm_user");
			
			$('#delivery_address_book').append($('<option>', { 
		        value: "",
		        text : "Añadir nueva dirección..." 
		        
		    }));
			
			ACC.checkout.selectAddress("delivery_address_book", "i18nAddressForm_delivery");
	
		},
	bindSelectUserAddress : function(){
		
		$('#user_address_book').change(function(){
			
			ACC.checkout.selectAddress("user_address_book", "i18nAddressForm_user");
		});
	}, 
	
	bindSelectDeliveryAddress : function(){
		
		$('#delivery_address_book').change(function(){
			
			ACC.checkout.selectAddress("delivery_address_book", "i18nAddressForm_delivery");
			
		});
	}, 
	fillInAddressForm : function(prefixForm, address){
		
		$("#"+prefixForm+"_addressId").val(address.id);
		$("#"+prefixForm+"_displayName").val(address.displayName);
		$("#"+prefixForm+"_firstName").val(address.firstName);	
		$("#"+prefixForm+"_lastName").val(address.lastName);	
		$("#"+prefixForm+"_line1").val(address.line1); 		
		$("#"+prefixForm+"_numExterno").val(address.numExterno);	
		$("#"+prefixForm+"_numInterno").val(address.numInterno); 
		$("#"+prefixForm+"_entrecalles").val(address.entrecalles);
		$("#"+prefixForm+"_colonia").val(address.colonia);	
		$("#"+prefixForm+"_postcode").val(address.postalCode); 	
		console.log(address.postalCode);
		loadRegionsAndCity(prefixForm);
		//$("#"+prefixForm+"_townCity" ).val(address.townCity);	
		//$("#"+prefixForm+"_regionIso").val(address.regionIso); 
		$("#"+prefixForm+"_phone").val(address.phone);	

	},
	resetAddressForm : function(prefixForm){
		
		$("#"+prefixForm+"_addressId").val("");
		$("#"+prefixForm+"_displayName").val("");
		$("#"+prefixForm+"_firstName").val("");	
		$("#"+prefixForm+"_lastName").val("");	
		$("#"+prefixForm+"_line1").val(""); 		
		$("#"+prefixForm+"_numExterno").val("");	
		$("#"+prefixForm+"_numInterno").val(""); 
		$("#"+prefixForm+"_entrecalles").val("");
		$("#"+prefixForm+"_colonia").val("");	
		$("#"+prefixForm+"_postcode").val(""); 	
		$("#"+prefixForm+"_townCity" ).val("");	
		$("#"+prefixForm+"_regionIso").val(""); 
		$("#"+prefixForm+"_phone").val("");	

	},
	
	checkoutDatosEnvioRadioBtns: function() {
		
		 
		 
	    // Radio misma dirección
	    $('#radioDireccionMisma').click(function() {
	        if ( $(this).is(':checked') ) {
	            $('#formularioRecogerSucursal.in').collapse('hide');
	            $('#formularioDireccionDiferente.in').collapse('hide');
	        }
	    });

	    // Radio otra dirección
	    $('#radioDireccionDiferente').click(function() {
	        if ( $(this).is(':checked') ) {
	            $('#formularioDireccionDiferente').collapse('show');
	            $('#formularioRecogerSucursal.in').collapse('hide');
	        }
	    });

	    // Radio sucursal
	    $('#radioSucursal').click(function() {
	        if ( $(this).is(':checked') ) {
	            $('#formularioRecogerSucursal').collapse('show');
	            $('#formularioDireccionDiferente.in').collapse('hide');
	        }
	    });
	    
	    var selected = $("input[name='radiosDireccion']:checked").val() 
	    if( selected == 'direccion-diferente'){
	    	 $('#radioDireccionDiferente').click();
	    }else if (selected == 'sucursal'){
	    	$('#radioSucursal').click();
	    }else{
	    	$('#radioDireccionMisma').click();
	    }
	}
};



$(window).load(function() {
	$('#payment_method').click(function(){
		var radio=$(this);
		if(radio.is(':checked')) {  
			$('#ppplusdata').show(); 
			$('#ppplus').show();
			setTimeout(function(){ 
				var ppp = PAYPAL.apps.PPP({
					"approvalUrl": "${approvalurl}",
					"placeholder": "ppplus",
					"payerFirstName":"${paypalName}",
					"payerLastName":"${paypallastName}",
					"payerEmail":"${paypalemail}",
					"payerPhone":"${paypaltlfn}",
					"payerTaxId":"",
					"buttonLocation": "outside",
					"disableContinue": "continueButton",
					"merchantInstallmentSelection":1,
					"enableContinue": "continueButton",
					"language":"es_MX",
					"country":"MX",
					"mode": "sandbox",}); 
				}, 500);
		} else {  
			$('#ppplusdata').hide();    
		}  
	});
	$('.div_select_ppplus > input').click(function(){
		var radio=$(this);
		$('.div_select_ppplus > span').removeClass('active');
		radio.next('span').addClass('active');
	});

		var texto=`<div class="sk-cube-grid">
					  <div class="sk-cube sk-cube1"></div>
					  <div class="sk-cube sk-cube2"></div>
					  <div class="sk-cube sk-cube3"></div>
					  <div class="sk-cube sk-cube4"></div>
					  <div class="sk-cube sk-cube5"></div>
					  <div class="sk-cube sk-cube6"></div>
					  <div class="sk-cube sk-cube7"></div>
					  <div class="sk-cube sk-cube8"></div>
					  <div class="sk-cube sk-cube9"></div>
					</div> 
					<p class="p-sk-circle"> Por favor espere ...</p></div>`;

		jQuery('#start-colorbox').colorbox({
			  html: texto,
			  width:"100%",
			  maxWidth:"300px",
			  closeButton: false,
			  scrolling:false,
			  title:false,
			  height: "auto",
			  overlayClose:false
			  });

		$('.checkout-steps > a').click(function(e){
			  e.stopImmediatePropagation();	
			  
			  var __this=$(this);
			
			var url;
			if(__this.attr('href')) {
				
				url=__this.attr('href');
				__this.attr('href', '');
				$('#cboxContent').css('height', '74px')
			  	  $('#start-colorbox').trigger( "click" );
				console.log('entra')
				setTimeout(function(){ window.location.href = url;}, 750);
				
			}
			if(__this.parent().attr('href')){
				
				url=__this.parent().attr('href');
				__this.parent().attr('href', '');
				$('#cboxContent').css('height', '74px')
			  	  $('#start-colorbox').trigger( "click" );
				setTimeout(function(){ window.location.href = url; }, 750);;
				
			
			}
			  return false;
		  })
		  $(document).on('click','.addressEntry > form > .btn, .checkout-next, #deliveryMethodSubmit, .btn-place-order',function(){
			
			  		$('#cboxContent').css('height', '74px')
			  	  $('#start-colorbox').trigger( "click" );
		  });
});