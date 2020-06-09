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
ACC.account = {

	_autoload: [
		"bindDatepicker",
		"bindNavRightMyAccount"
	],

	bindDatepicker: function ()
	{
		
		$('.datepicker').bootstrapDP({
			startView: 2,
			autoclose: true,
		    language: $('body').hasClass('language-es')? 'es':'en',
		    format:"dd/mm/yyyy"	
		});
	},
	
	bindNavRightMyAccount: function(){
//		enquire.register("screen and (max-width:"+screenSmMax+")", {
//
//            match : function() {
				$(document).on("click",'button.btn-my-account',function(){
					$(this).addClass('btn-my-account-open');
					$('.accountNav').show('500');
					$('.overlayAccountNav').show();
					if(!$('body').hasClass('tiendarayados-body')){
						$('body').css('overflow','hidden');
					}
					
				});
				
				$(document).on("click",'.headline span.glyphicon-remove',function(){
					$('button.btn-my-account').removeClass('btn-my-account-open');
					$('.accountNav').hide('500');
					$('.overlayAccountNav').hide();
					$('body').css('overflow','auto');

				});
				$(document).on("click",'.btn-my-account-open',function(){
					$(this).removeClass('btn-my-account-open');
					$('.accountNav').hide('500');
					$('.overlayAccountNav').hide();
					$('body').css('overflow','auto');

				});
//            }
//		});
	},
	bindWishlistQtyChange: function(){
		$(document).on("click", '.js-qty-change', function (event) {

			var button = $(this);
		 	var input = $($(this).data('qtyid'));
		 
		 	if(button.attr('id').includes('minus_')){
		 		if(!isNaN(input.val()) && input.val() > 1){
		 			input.val(input.val() - 1);
		 			input.trigger('change');
		 		}
		 	}else if(button.attr('id').includes('plus_')){
		 		if(!isNaN(input.val())){
		 			input.val(parseInt(input.val()) + 1);
		 			input.trigger('change');
		 		}
		 	}
			 	
			 	
	        return false;
	 	});
	}
};