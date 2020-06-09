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
ACC.addtocartaction = {

		enableConfigurationButton : function(){
			
			if($(".radio-personalize") != null){
				
				$(".radio-personalize").on("change", function(){
						 if($(this).val() == "true"){
							 if (!($(this).hasClass('outOfStock') || $(this).hasClass('out-of-stock'))) {
					                $(".js-configure-btn").removeAttr("disabled");
					            }
					           
						 }else{
							 $(".js-configure-btn").attr("disabled", "disabled");
						 }
					 });
			}
		}
}

$(document).ready(function ()
{
	with (ACC.addtocartaction)
	{
		ACC.addtocartaction.enableConfigurationButton();
	}
});


