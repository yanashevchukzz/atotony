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
//Makes Color Box Responsive
var cboxOptions = {
	width: '95%',
	maxWidth: '960px',
}

$('.cbox-link').colorbox(cboxOptions);

$(window).resize(function(){

    if(!$('#colorbox').hasClass('variantSelectMobile')){
        $.colorbox.resize({
            width: window.innerWidth > parseInt(cboxOptions.maxWidth) ? cboxOptions.maxWidth : cboxOptions.width,
        });
    }
});


ACC.colorbox = {
	config: {
		maxWidth:"100%",
		opacity:0.7,
		width:"auto",
		transition:"none",
		close:'<span class="glyphicon glyphicon-remove"></span>',
		title:'<div class="headline"><span class="headline-text">{title}</span></div>',
		fixed: true,
		onComplete: function() {
			$.colorbox.resize();
			ACC.common.refreshScreenReaderBuffer();
		},
		onClosed: function() {
			ACC.common.refreshScreenReaderBuffer();
		}
	},

	open: function(title,config){
		var config = $.extend({},ACC.colorbox.config,config);
		if (config.title != '') {
		    config.title = config.title.replace(/{title}/g,title);
		} else {
		    config.title = false;
		}
		ACC.global.switchInterval(false);
		return $.colorbox(config);
	},

	resize: function(){
		$.colorbox.resize();
	},

	close: function(){
		$.colorbox.close();
	},

	showLoader : function() {
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
		ACC.colorbox.open("",{
			html: texto,
			width:"100%",
			maxWidth:"300px",
			height: "76px",
			closeButton: false,
			scrolling:false,
			overlayClose:false
		});
		$("#colorbox #cboxWrapper #cboxLoadedContent").css({"margin-top":"0px","padding":"0"});
		$("#cboxContent").css("height","auto");
	}
};

