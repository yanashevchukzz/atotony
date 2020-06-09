ACC.geolocation = {
    checkGeolocation : function(callback) {
        if(typeof ACC.geolocation.coords == "undefined" || (!ACC.geolocation.coords.latitude && !ACC.geolocation.coords.longitude)) {
            $.ajax({
                url: '/geoPosition/get',
                type: 'GET',
                dataType: "json",
                success: function(response) {
                    if(response.latitude != "" || response.longitude != ""){
                        ACC.geolocation.coords = response;
                        if(typeof callback == "function")
                            callback();
                    } else
                        ACC.geolocation.askGeolocation(callback);
                }
            });
        } else {
            if(typeof callback == "function")
                callback();
        }
    },
    askGeolocation : function(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                ACC.geolocation.coords = position.coords;
        	    $.ajax({
        			url: '/geoPosition/current?latitude=' + ACC.geolocation.coords.latitude + '&longitude=' + ACC.geolocation.coords.longitude,
        			timeout: 600000,
        			type: "get",
        			success: function(response) {
        			    if(response == "true")
        			        console.log("Current geolocation: " + ACC.geolocation.coords.latitude + ", " + ACC.geolocation.coords.longitude);
        			    if(typeof callback == "function")
        			        callback();
        			}
        		});
              });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
}
