BASE.require([
		"jQuery",
        "jQuery.fn.region",
        "BASE.util.invokeMethodIfExistsAsync",
        "BASE.util.invokeMethodIfExists"
], function () {
    var invokeMethodIfExistsAsync = BASE.util.invokeMethodIfExistsAsync;
    var invokeMethodIfExists = BASE.util.invokeMethodIfExists;
    var Future = BASE.async.Future;

    BASE.namespace("components.gem");

    components.gem.WindowManager = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $veil = $(tags["veil"]);
        var $windowContainer = $(tags["window-container"]);
        var allWindows = [];
        var zIndex = 1;

        var createWindowAsync = function (config) {
            var componentName = config.componentName;
            var content = config.content;
            var attributes = config.attributes || {};
            var width = config.width || 400;
            var height = config.height || 400;

            var $component = $("<div></div>");
            attributes.component = componentName;
            $component.attr(attributes);
            $content = $(content).appendTo($component);

            return BASE.web.components.createComponentAsync("gem-window", $component).chain(function (element) {
                var $window = $(element);
                var windowController = $window.controller();
                var componentElement = windowController.getComponent();
                var $componentElement = $(componentElement);
                var controller = $componentElement.controller() || {};
                var region = $windowContainer.region();

                $componentElement.addClass("absolute-fill-parent");

                $window.css({
                    width: width + "px",
                    height: height + "px",
                    position: "absolute",
                    top: parseInt((region.height / 2) - (height / 2), 10),
                    left: parseInt((region.width / 2) - (width / 2), 10)
                }).addClass("hide").appendTo($windowContainer);

                if (config.isModal) {
                    $window.attr("isModal", "true");
                }

                invokeMethodIfExists(controller, "init", [windowController]);

                var placeVeil = function () {
                    var elementArray = $windowContainer.children("[isModal]:not(.hide)").toArray()

                    if (elementArray.length === 0) {
                        $veil.addClass("hide");
                    } else {
                        $veil.removeClass("hide");
                        var elementInfo = elementArray.map(function (element) {
                            var $elem = $(element);
                            return {
                                $element: $elem,
                                zIndex: parseInt($elem.css("z-index"), 10)
                            };
                        }).reduce(function (elementInfo, next) {
                            if (elementInfo.zIndex > next.zIndex) {
                                return elementInfo;
                            } else {
                                return next;
                            }
                        });

                        $veil.css("zIndex", elementInfo.zIndex);
                    }
                };

                var delegate = {
                    closeAsync: function () {
                        var future = invokeMethodIfExistsAsync(controller, "prepareToDeactivateAsync");

                        return future.chain(function () {
                            $window.css("z-index", 0).addClass("hide");
                            placeVeil();
                            invokeMethodIfExists(controller, "deactivated");
                        });

                    },
                    centerAsync: function () {
                        var containerRegion = $elem.region();
                        var windowRegion = $window.region();

                        var top = (containerRegion.height / 2) - (windowRegion.height / 2);
                        var left = (containerRegion.width / 2) - (windowRegion.width / 2);

                        $window.offset({
                            left: left,
                            top: top
                        });

                        return Future.fromResult();
                    },
                    showAsync: function () {
                        var future = invokeMethodIfExistsAsync(controller, "prepareToActivateAsync");
                        var self = this;

                        return future.chain(function () {
                            $window.removeClass("hide");
                            zIndex++;
                            $window.css("z-index", zIndex);

                            placeVeil();

                            delegate.centerAsync().try();

                            invokeMethodIfExists(controller, "activated");

                        });


                    },
                    disposeAsync: function () {
                        var future = invokeMethodIfExistsAsync(controller, "prepareToDisposeAsync");

                        return future.chain(function () {
                            placeVeil();
                            $window.removeClass("hide");
                            invokeMethodIfExists(controller, "disposed");
                            $window.remove();
                        });

                    },
                    focus: function () {
                        if (!config.isModal) {
                            zIndex++;
                            $window.css("z-index", zIndex);
                        }

                        placeVeil();
                    }
                };

                windowController.setDelegate(delegate);

                return {
                    element: componentElement,
                    controller: controller,
                    window: windowController
                };
            });
        };

        self.saveAsync = function () { };

        self.validateAsync = function () { };

        self.createModalAsync = function (config) {
            config.isModal = true;
            return createWindowAsync(config);
        };

        self.createWindowAsync = function (config) {
            return createWindowAsync(config);
        };



        services.set("windowService", self);
    };
});