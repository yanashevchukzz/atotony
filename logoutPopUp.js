ACC.logoutPopUp = {

		_autoload: [
			"bindLogout",
			],

			bindLogout: function () {
				$(document).on("click", ".js-logout-popup", function (e) {
					e.preventDefault();
					var title = $(".js-logout-popup-content").data("title");
					ACC.colorbox.open(title, {
						html: $(".js-logout-popup-content").html()
					});
				});

				$(document).on("click", ".js-logout-popup-cancel", function (e) {
					ACC.colorbox.close();
				});
			}
}