ACC.giftcard = {

    _autoload: [
       "onloadValidation",
       "bindAmountChange",
       "bindTypeChange",
       "bindCheckBalance",
       "bindGiftCardEventHandler",
       "bindDisplayPersonalization"
    ],

	onloadValidation: function ()
	{
		//ACC.giftcard.showHideDigitalInfo();
		ACC.giftcard.showHideAmount();
		$("#sendingdate").datepicker({dateFormat: 'dd/mm/yy'});
		 if($("#digitalCheck").is(":checked")){
			 $("#digitalInfo").show();
		 }
		 
	},

	bindAmountChange: function ()
	{
		$(".radio-amount, input-text-amount").on("change", function(){
			 if($(this).val() == "other"){
				 $(".text-amount").val("");
				 $("#customAmount").show();
			 }else{
				 $(".text-amount").val($(this).val());
				 $("#customAmount").hide();
			 }
		 })
		 
	},
	
	bindTypeChange: function ()
	{
		//$(".radio-type").on("change", function(){
		//	ACC.giftcard.showHideDigitalInfo();
		 //});
		$("#digitalCheck").on("change", function(){
			ACC.giftcard.showHideDigitalInfo();
		});
		if($("#digitalCheck").is(":checked")){
			 $("#digitalInfo").show();
		 }
	},
	showHideAmount: function(){
		$(".radio-amount").each(function(){
			if( parseFloat($(".text-amount").val()) == parseFloat($(this).val()))
			{
				$(this).attr("checked","checked");
			}
		})
	},
	showHideDigitalInfo: function(){

		//if($(".radio-type").val() == 'DIGITAL' ){
		//	 $("#digitalInfo").show();
		//	 $("#phisicalInfo").hide();
		//	 $("#digitalCheck").removeAttr("checked");
		// }else
			 if($("#digitalCheck").is(":checked")){
			 $("#digitalInfo").show();
			// $("#phisicalInfo").show();
		 }else{
			 $("#digitalInfo").hide();
			// $("#phisicalInfo").show();
		 }


	},
	bindCheckBalance: function(){
		
		// Submit event handler
		$('#checkGiftcardForm').submit(function() {
			// Init the giftcard error label
			$('.giftcard-error-label').empty();

			// Form validation
			if($('#card_number').val() == ''){
				var errorTarjeta= $('#errorTarjeta').data("error-tarjeta");
				$('#errorTarjeta').text(errorTarjeta);
				return false;
			}
			if($('#folio').val() == ''){
				var errorFolio= $('#errorFolio').data("error-folio");
				$('#errorFolio').text(errorFolio);
				return false;
			}

			// Option set
			var options = { 
			       success: ACC.giftcard.showGiftcardBalance // Callback function when success
			    };
			
		    // Send ajax request
		    $(this).ajaxSubmit(options); 
		    
		    // return false to prevent normal browser submit and page navigation 
		    return false; 
		});
		
		// checkBalanceAgain button click event handler
		$("#checkBalanceAgain").on("click", function(){
			window.location.reload();
		})
	},
	
	
	showGiftcardBalance : function(response, status, xhr, $form){
		var $giftcardMovements = $('#giftcardMovements tbody');
		var $giftcardMovementTmp = $('#giftcardMovements tbody tr').clone();
		$giftcardMovements.empty();
		console.log(status);
		
		// Response validation
		if(status != 'success')
		{
			var errorPeticion= $('#errorGeneral').data("error-peticion");
			$('#errorGeneral').html('errorPeticion');
			return false;
		}
		if(response.status == 'error') {
			//$('#errorGeneral').html('El número de tarjeta o folio es incorrecto');
			var err= $('#errorGeneral').data("error");
			$('#errorGeneral').html(err);
			return false;
		}
		
		// Append the movements to the table
		$.each(response.movimientos, function( key, value ) {
			var $giftcardMovement = $giftcardMovementTmp.clone();
			
			$giftcardMovement.find('.fecha').html(value.fechaOperacion);
			$giftcardMovement.find('.autonumsuc').html(value.autonumsuc + '(' + value.tipoOperacion + ')');
			$giftcardMovement.find('.cargo').html(value.cargo);
			$giftcardMovement.find('.abono').html(value.abono);
			$giftcardMovements.append($giftcardMovement);
		});

		// Set the attributes
		$('.showBalance .folio').text(response.folio);
		$('.showBalance .cardNumber').text(response.cardNumber);
		$('.showBalance .saldo').text(response.saldo);
		
		// Manage the containers
		$('.gf-col-consulta').hide();
		$('.showBalance').show();
	},

    bindGiftCardEventHandler : function(){
        $('#gcto-other').on("click", function(){
            $("#sendtome").val(false);
        })
        $('#gcto-me').on("click", function(){
            $("#sendtome").val(true);
        })
        $('.js_gc-update-btn').on("click", function(){
            $('#giftcardConfigurationForm').submit();
        })
        $('.gc-amout').on('click', '.form-check-input', function(){
            if($(this).val()=='other'){
                $('.other-field').show();
            } else {
                $('.other-field').hide();
            }
        })
        $('.pers-gc').on('click', '.form-check-input-pers', function(){
            if($(this).val()=='gcto-me'){
                $('.gc-sendittome').show();
                $('.gc-sendittoanother').hide();
            } else {
                $('.gc-sendittoanother').show();
                $('.gc-sendittome').hide();
            }

        })
        $('.also-sendme').on('click', '.form-check-input-sentome', function(){
            if($(this).is(':checked')){
                $('.form-senttome').show();
            } else {
                $('.form-senttome').hide();
            }
        })
        $('.datepickeris').datepicker();
    },

    bindDisplayPersonalization : function(){
        if($('#sendtome') && $('#sendtome').val() == "false"){
            $('#gcto-other').prop('checked', true);
            $('.gc-sendittoanother').show();
            $('.gc-sendittome').hide();
        }else{
            $('#gcto-me').prop('checked', true);
            $('#sendtome').val(true);
        }
    },

	submitGiftCardForm : function(){
            var qty = parseInt($("#selected-cantidad").text());
            if(isNaN(qty)){
                qty = 1;
            }
            $("#quantity").val(qty);
            $('#giftcardConfigurationForm').submit();
	}
	
};

