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
ACC.ratingstars = {

	_autoload: [
		//["bindRatingStars", $(".js-ratingCalc").length > 0],
		["bindRatingStarsSet", $(".js-ratingCalcSet").length > 0]
	],
	bindRatingStars: function(){
		$(".js-ratingCalc").each(function(){
            var rating =  $(this).data("rating");
//            console.log($(this).width() + " - " + $(this).find(".js-greyStars").width());
//            console.log(" rating : " + parseFloat(rating.rating, 10));
//            console.log(" total : " + parseFloat(rating.total, 10));            
            $(this).find(".js-greenStars").width($(this).width() * ( parseFloat(rating.rating, 10) / parseFloat(rating.total, 10) ));
		})
	},
	bindRatingStarsSet: function(){
        $('.js-writeReviewStars').on({
            mouseleave: function mouseleave(){
                clearReviewState();
                var sV = (parseFloat( $(".js-ratingSetInput").val(), 10)) * 2;
                (typeof sV === "number" && !isNaN(sV) )? setReviewState(sV) : clearReviewState();
            }
        });
        var ratingIcons ;
        var clearReviewState = function(){
            ratingIcons.removeClass('active');
        };
        var setReviewState = function(index){
            ratingIcons.slice(0, parseFloat(index,10) ).addClass('active');
        };
        setTimeout(function(){ ratingIcons = $('.js-writeReviewStars .js-ratingIcon');         
            ratingIcons.on({
                mouseenter: function mouseenter(){
                    clearReviewState();
                    setReviewState( $(this).index()+1 );
                },
                mouseleave: function mouseleave(){
                    $(this).removeClass('active');
                },
                click: function click(){
                    $(".js-ratingSetInput").val( ($(this).index() + 1) /2);
                }
            });
        }, 300);
	}
}

$(window).load(function(){
	ACC.ratingstars.bindRatingStars();	
});