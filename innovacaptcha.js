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
ACC.captcha = {
   bindAll: function ()
   {
      this.renderWidget();
   },
 
   renderWidget: function ()
   {
      $.ajax({
         url: ACC.config.encodedContextPath + "/register/captcha/widget/recaptcha",
         type: 'GET',
         cache: false,
         success: function (html)
         {
            if ($(html) != [])
            {
               $(html).appendTo('.js-recaptcha-captchaaddon');
               $.getScript('https://www.google.com/recaptcha/api.js?hl=' + document.documentElement.lang, function ()
               {
                  if ($('#recaptchaChallangeAnswered').val() == 'false')
                  {
                     $('#g-recaptcha_incorrect').show();
                  }
               });
            }
         }
      });
   }
};
 
$(document).ready(function ()
{
   if ($('#customRegisterForm') != null)
   {
      ACC.captcha.bindAll();
   }
});
