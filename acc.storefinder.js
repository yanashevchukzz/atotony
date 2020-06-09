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
ACC.storefinder = {

    _autoload: [
        ["init", $(".js-store-finder").length != 0],
        ["bindStoreChange", $(".js-store-finder").length != 0],
        ["bindSearch", $(".js-store-finder").length != 0],
        "bindPagination"
    ],

    storeData: "",
    storeId: "",
    coords: {},
    storeSearchData: {},

    createListItemHtml: function(data, id) {

        var item = "";
        item += '<li class="list__entry">';
        item += '<input type="radio" name="storeNamePost" value="' + data.displayName + '" id="store-filder-entry-' + id + '" class="js-store-finder-input" data-id="' + id + '">';
        item += '<label for="store-filder-entry-' + id + '" class="js-select-store-label">';
        item += '<span class="entry__info">';
        item += '<span class="entry__name">' + data.displayName + '</span>';
        item += '<span class="entry__address">' + data.line1 + ' ' + data.line2 + '</span>';
        item += '<span class="entry__city">' + data.town + '</span>';
        item += '<span class="entry__phone">' + data.phone + '</span>';
        item += '</span>';
        item += '<span class="entry__distance">';
        item += '<span>' + data.formattedDistance + '</span>';
        item += '</span>';
        item += '</label>';
        item += '</li>';
        return item;
    },

    refreshNavigation: function() {
        var listitems = "";
        data = ACC.storefinder.storeData

        if (data) {
            for (i = 0; i < data["data"].length; i++) {
                listitems += ACC.storefinder.createListItemHtml(data["data"][i], i)
            }

            $(".js-store-finder-navigation-list").html(listitems);

            // select the first store
            var firstInput = $(".js-store-finder-input")[0];
            $(firstInput).click();
        }


        var page = ACC.storefinder.storeSearchData.page;
        $(".js-store-finder-pager-item-from").html(page * 10 + 1);

        var to = ((page * 10 + 10) > ACC.storefinder.storeData.total) ? ACC.storefinder.storeData.total : page * 10 + 10;
        $(".js-store-finder-pager-item-to").html(to);
        $(".js-store-finder-pager-item-all").html(ACC.storefinder.storeData.total);
        $(".js-store-finder").removeClass("show-store");

    },


    bindPagination: function() {



        $(document).on("click", ".js-store-finder-details-back", function(e) {
            e.preventDefault();

            $(".js-store-finder").removeClass("show-store");

        })




        $(document).on("click", ".js-store-finder-pager-prev", function(e) {
            e.preventDefault();
            var page = ACC.storefinder.storeSearchData.page;
            ACC.storefinder.getStoreData(page - 1)
            checkStatus(page - 1);
        })

        $(document).on("click", ".js-store-finder-pager-next", function(e) {
            e.preventDefault();
            var page = ACC.storefinder.storeSearchData.page;
            ACC.storefinder.getStoreData(page + 1)
            checkStatus(page + 1);
        })

        function checkStatus(page) {
            if (page == 0) {
                $(".js-store-finder-pager-prev").attr("disabled", "disabled")
            } else {
                $(".js-store-finder-pager-prev").removeAttr("disabled")
            }

            if (page == Math.floor(ACC.storefinder.storeData.total / 10)) {
                $(".js-store-finder-pager-next").attr("disabled", "disabled")
            } else {
                $(".js-store-finder-pager-next").removeAttr("disabled")
            }
        }

    },


    bindStoreChange: function() {
        $(document).on("change", ".js-store-finder-input", function(e) {
            e.preventDefault();



            storeData = ACC.storefinder.storeData["data"];

            var storeId = $(this).data("id");

            var $ele = $(".js-store-finder-details");



            $.each(storeData[storeId], function(key, value) {
                if (key == "image") {
                    if (value != "") {
                        $ele.find(".js-store-image").html('<img src="' + value + '" alt="" />');
                    } else {
                        $ele.find(".js-store-image").html('');
                    }
                } else if (key == "productcode") {
                    $ele.find(".js-store-productcode").val(value);
                } else if (key == "openings") {
                    if (value != "") {
                        var $oele = $ele.find(".js-store-" + key);
                        var openings = "";
                        $.each(value, function(key2, value2) {
                            openings += "<dt>" + key2 + "</dt>";
                            openings += "<dd>" + value2 + "</dd>";
                        });

                        $oele.html(openings);

                    } else {
                        $ele.find(".js-store-" + key).html('');
                    }

                } else if (key == "specialOpenings") {} else if (key == "features") {
                    var features = "";
                    $.each(value, function(key2, value2) {
                        features += "<li>" + value2 + "</li>";
                    });

                    $ele.find(".js-store-" + key).html(features);

                } else {
                    if (value != "") {
                        $ele.find(".js-store-" + key).html(value);
                    } else {
                        $ele.find(".js-store-" + key).html('');
                    }
                }

            })


            ACC.storefinder.storeId = storeData[storeId];
            // ACC.storefinder.initGoogleMap();
            ACC.storefinder.loadGoogleMap()

        })

        $(document).on("click", ".js-select-store-label", function(e) {
            $(".js-store-finder").addClass("show-store")
        })

        $(document).on("click", ".js-back-to-storelist", function(e) {
            $(".js-store-finder").removeClass("show-store")
        })

    },



    initGoogleMap: function() {

        if ($(".js-store-finder-map").length > 0) {
            ACC.global.addGoogleMapsApi("ACC.storefinder.loadGoogleMap");
        }
    },

    loadGoogleMap: function() {

        storeInformation = ACC.storefinder.storeId;
        if ($(".js-store-finder-map").length > 0 && typeof google === 'object' && typeof google.maps === 'object') {
            $(".js-store-finder-map").attr("id", "store-finder-map")
            var centerPoint = new google.maps.LatLng(storeInformation["latitude"], storeInformation["longitude"]);

            var mapOptions = {
                zoom: 13,
                zoomControl: true,
                panControl: true,
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: centerPoint
            }

            var map = new google.maps.Map(document.getElementById("store-finder-map"), mapOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(storeInformation["latitude"], storeInformation["longitude"]),
                map: map,
                title: storeInformation["name"],
                icon: "https://maps.google.com/mapfiles/marker" + 'A' + ".png"
            });
            var infowindow = new google.maps.InfoWindow({
                content: $(".store__finder--details-info").clone().css('display','block')[0],
                disableAutoPan: true
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        }
        $.colorbox.close();
    },


    bindSearch: function() {

        $(document).on("submit", '#storeFinderForm', function(e) {
            e.preventDefault();
            $("#js-store-finder-searchterm").css("display", "none");
            $(".js-store-finder-search-input").css("border-color", "#cccccc");

            var q = $(".js-store-finder-search-input").val();
            if (q.length > 0) {
                ACC.storefinder.geocodeAddress(q);
            } else {
                if ($(".js-storefinder-alert").length < 1) {
                    $("#js-store-finder-searchterm").css("display", "flex");
                    $(".js-store-finder-search-input").css("border-color", "firebrick");
                }
            }
        })


        $(".js-store-finder").hide();


        $(document).on("click", '#findStoresNearMe', function(e) {
            e.preventDefault()
            ACC.storefinder.getInitStoreData(null, ACC.geolocation.coords.latitude, ACC.storefinder.coords.longitude);
        })


    },

    geocodeAddress: function(address) {

        if (address.indexOf("mexico") == -1) {
            address += " mexico";
        }
        //console.log("start geocoding with js API");
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status == 'OK') {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                //console.log("found location " + results[0].geometry.location);
                ACC.storefinder.getInitStoreData(address, latitude, longitude);
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    },


    getStoreData: function(page) {
        ACC.storefinder.storeSearchData.page = page;
        url = $(".js-store-finder").data("url");
        $.ajax({
            url: url,
            data: ACC.storefinder.storeSearchData,
            type: "get",
            success: function(response) {
                ACC.storefinder.storeData = $.parseJSON(response);
                ACC.storefinder.refreshNavigation();
                if (ACC.storefinder.storeData.total < 10) {
                    $(".js-store-finder-pager-next").attr("disabled", "disabled");
                }
            }
        });
    },

    getInitStoreData: function(q, latitude, longitude) {
        $(".alert").remove();
        data = {
            "q": "",
            "page": 0
        }
        if (q != null) {
            data.q = q;
        }
        if(latitude == null && longitude == null && typeof ACC.geolocation.coords == "undefined")
            return false;
        data.latitude = (latitude != null) ? latitude : ACC.geolocation.coords.latitude;

        data.longitude = (longitude != null) ? longitude : ACC.geolocation.coords.longitude;

        ACC.storefinder.storeSearchData = data;
        ACC.storefinder.getStoreData(data.page);
        $(".js-store-finder").show();
        $(".js-store-finder-pager-prev").attr("disabled", "disabled")
        $(".js-store-finder-pager-next").removeAttr("disabled")
    },

    init: function() {
        ACC.storefinder.initGoogleMap();
        var spinner = `<div class="sk-cube-grid">
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

        jQuery('#start-colorbox').colorbox({
            html: spinner,
            width: "100%",
            maxWidth: "300px",
            closeButton: false,
            scrolling: false,
            title: false,
            height: "auto",
            overlayClose: false
        });

        $("#findStoresNearMe").attr("disabled", "disabled");
        if(typeof ACC.geolocation != "undefined") {
            ACC.geolocation.checkGeolocation(ACC.storefinder.getInitStoreData);
            setTimeout(function() {
                if (typeof ACC.geolocation.coords == "undefined") {
                    ACC.storefinder.getInitStoreData(null, 19.42847, -99.12766);
                }
            }, 500);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        ACC.storefinder.coords = position.coords;
                        $('#findStoresNearMe').removeAttr("disabled");

                        ACC.storefinder.getInitStoreData(null, ACC.storefinder.coords.latitude, ACC.storefinder.coords.longitude);
                    },
                    function(error) {
                        ACC.storefinder.getInitStoreData(null, 23.634501, -102.55278399999997);
                        console.log("An error occurred... The error code and message are: " + error.code + "/" + error.message);
                    }
                );
            }
        }

        $('#start-colorbox').trigger("click");
    }
};