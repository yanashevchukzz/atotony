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
ACC.paginationsort = {

	downUpKeysPressed: false,

	bindAll: function ()
	{
		this.bindPaginationSort();
	},
	bindPaginationSort: function ()
	{
		with (ACC.paginationsort)
		{
			bindSortForm($('#sortForm1'));
			bindSortForm($('#sortForm2'));
		}
	},
	bindSortForm: function (sortForm)
	{
//  browser.msie has been removed from jQuery as of version 1.9. Modernizr is recommended as a replacement
//	issue created
//		if ($.browser.msie)
//		{
// 			this.sortFormIEFix($(sortForm).children('select'), $(sortForm).children('select').val());
//		}

		sortForm.change(function ()
		{
//			if (!$.browser.msie)
//			{
//				this.submit();
//			}
//			else
//			{
				if (!ACC.paginationsort.downUpPressed)
				{
					this.submit();
				}
				ACC.paginationsort.downUpPressed = false;
//			}
		});
	},
	sortFormIEFix: function (sortOptions, selectedOption)
	{
		sortOptions.keydown(function (e)
		{
			// Pressed up or down keys
			if (e.keyCode === 38 || e.keyCode === 40)
			{
				ACC.paginationsort.downUpPressed = true;
			}
			// Pressed enter
			else if (e.keyCode === 13 && selectedOption !== $(this).val())
			{
				$(this).parent().submit();
			}
			// Any other key
			else
			{
				ACC.paginationsort.downUpPressed = false;
			}
		});
	}
};



$(document).ready(function ()
{
	ACC.paginationsort.bindAll();
	

	$('#my_selection').on('change',function(e){						
		var urlSinParam = window.location.href.split('?')[0];
		var urlConParam = window.location.href;					
		if(hasParameters()){						
			if(getURLParameter("size")){
				var url3 = replaceUrlParam(urlConParam,"size",$(this).find('option').filter(':selected').text());
				window.location.href= url3;
			}else{
				var url1 = urlConParam + '&size=' + $(this).find('option').filter(':selected').text();
				window.location.href= url1;
			}
		}else{						
			var url2 = urlConParam + '?size=' + $(this).find('option').filter(':selected').text();
			window.location.href= url2;
		}
	})
	
});

function hasParameters(){
	 var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    if(sURLVariables.length >= 1 && sURLVariables!=""){
   	 return true;
    }else{
   	 return false;
    }
}

function getURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return true;
        }
    }
}

function replaceUrlParam(url, paramName, paramValue){
   if(paramValue == null)
       paramValue = '';
   var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)')
   if(url.search(pattern)>=0){
       return url.replace(pattern,'$1' + paramValue + '$2');
   }
   return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue 
}
