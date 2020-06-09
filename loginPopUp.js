ACC.loginPopUp = {

    _autoload: [
        ["bindPopoUpLoginLink", $('.js-loginpopup').length != 0]

    ],

    bindPopoUpLoginLink: function() {
        $(document).on("click", ".js-loginpopup", function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            var popupTitle = $(this).data('delete-popup-title');
            ACC.colorbox.open(popupTitle, {
                href: url,
                type: "GET",
                width: "885px",
                // height: "695px",
                close: '<span class="login-popup-close"></span>',
                scrolling: false,
                className: 'modal-login',
                onComplete: function() {
                    ACC.colorbox.resize();
                }
            });
        });
        $(document).on("click", ".js-loginpopup-close-button", function(e) {
            e.preventDefault();
            ACC.colorbox.close();
        });
    }
}