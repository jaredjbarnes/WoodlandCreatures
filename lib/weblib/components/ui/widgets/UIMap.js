BASE.require([
    "jQuery",
    "BASE.collections.ObservableArray",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("components.ui.widgets");

    components.ui.widgets.UIMap = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var mapCanvas = tags['map-canvas'];
        var directionsPanel = tags['directions-panel'];
        var inited = false;
        var markers = [];
        var map = null;
        var markerDataToMarkers = new BASE.collections.Hashmap();
        var currentInfoWindow = null;

        BASE.collections.ObservableArray.call(markers);

        var getCurrentLocation = new BASE.async.Future(function (setValue, setError) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (result) {
                    setValue(new google.maps.LatLng(result.coords.latitude, result.coords.longitude));
                }, setError);
            } else {
                setError();
            }
        });

        var getDirectionsService = new BASE.async.Future(function (setValue, setError) {
            setValue(new google.maps.DirectionsService());
        });


        var directionsRenderer = null;
        var getDirectionsRenderer = function () {
            if (directionsRenderer === null) {
                directionsRenderer = new google.maps.DirectionsRenderer();
                directionsRenderer.setMap(map);
                directionsRenderer.setPanel(directionsPanel);
            }
            return directionsRenderer;
        };

        markers.observe(function (event) {
            event.newItems.forEach(function (m) {
                m.setMap(map);
            });
            event.oldItems.forEach(function (m) {
                m.setMap(null);
            });
        });

        self.init = function (options) {
            if (!inited) {
                options = options || {};
                options.center = options.center || new google.maps.LatLng(37.675924, -113.066377);
                options.zoom = options.zoom || 10,
                options.backgroundColor = options.backgroundColor || '#dcdce2';
                options.panControl = true;
                options.zoomControl = true;
                options.minZoom = 4;
                options.maxZoom = 19;
                options.streetViewControl = true;
                options.mapTypeId = google.maps.MapTypeId.ROADMAP;
                options.draggable = true;
                map = new google.maps.Map(mapCanvas, options);

                inited = true;
            }
        };
		
		self.resetSize = function () {
            google.maps.event.trigger(map, 'resize');
            map.setZoom(map.getZoom());
        }

        self.moveToCurrentLocation = function () {
            getCurrentLocation.then(function (location) {
                map.panTo(location);
            });
        };

        self.addMarker = function (data) {
            // expect {latitude:123, longitude:123, title:"title", description:"show up in a box"}
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.latitude, data.longitude),
                title: data.title
            });
            google.maps.event.addListener(marker, "click", function () {
                if (currentInfoWindow) {
                    currentInfoWindow.setMap(null);
                }
                var infoWindow = new google.maps.InfoWindow({
                    content: data.description
                });
                infoWindow.open(map, marker);
                currentInfoWindow = infoWindow;
            });

            markerDataToMarkers.add(data, marker);
            markers.push(marker);
        };

        self.removeMarker = function (data) {
            var marker = markerDataToMarkers.remove(data);
            markers.remove(marker);
        };

        self.clearDirections = function () {
            var renderer = getDirectionsRenderer();
            renderer.setDirections({ routes: [] });
        };

        self.clearMarkers = function () {
            $(directionsPanel).addClass("hide");
            self.clearDirections();
            markerDataToMarkers.getKeys().forEach(function (key) {
                self.removeMarker(key);
            });
        };

        self.setMarkers = function (value) {
            self.clearMarkers();
            value.forEach(function (data) {
                self.addMarker(data);
            });
        };

        self.zoomToFitMarkers = function (zoomLevel) {
            var bounds = new google.maps.LatLngBounds();

            markers.forEach(function (item) {
                bounds.extend(item.position);
            });

            if (zoomLevel) {
                var listener = google.maps.event.addListener(map, "idle", function () {
                    map.setZoom(zoomLevel);
                    google.maps.event.removeListener(listener);
                });
            }

            map.fitBounds(bounds);
        };

        self.hideRoute = function () {
            $(directionsPanel).addClass("hide");
        };

        self.route = function () {
            var origin = null;
            var waypoints = null;
            var destination = null;

            var doRoute = function () {
                var request = {
                    origin: origin,
                    destination: destination,
                    waypoints: waypoints,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING,
                    optimizeWaypoints: true,
                    avoidHighways: false,
                    avoidTolls: false
                };

                getDirectionsService.then(function (service) {
                    service.route(request, function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            var renderer = getDirectionsRenderer();
                            renderer.setDirections(response);
                            $(directionsPanel).removeClass("hide");
                        }
                    });
                });
            };


            getCurrentLocation.then(function (location) {
                origin = location;
                waypoints = markers.map(function (marker) { return { location: marker.position }; });
                destination = waypoints.splice(waypoints.length - 1, 1)[0].location;
                doRoute();
            }).ifError(function () {
                origin = markers[0].position;
                waypoints = markers.slice(0, 1).map(function (marker) { return { location: marker.position }; });
                destination = waypoints.splice(waypoints.length - 1, 1)[0].location;
                doRoute();
            });
        };

    };
});