BASE.require([
    "jQuery",
    "jQuery.allEasings",
    "BASE.async.Future"
], function() {
    BASE.namespace("components.ui.layouts");

    var Sidebar = function (content, options) {
        var self = this;
        var size = options.size;
        var color = options.color;
        var $wrapper = $('<div class="sidebar-wrapper" style="width:' + size + 'px; background-color:' + color +';"></div>');
        var $container = $('<div class="sidebar-content-wrapper" style="width:' + size + 'px; height: 100%;"></div>');
        var observable = new BASE.util.Observable();
        var showing = false;

        $wrapper.append($container);
        $container.append(content);

        self.wrapper = $wrapper[0];
        self.content = content;

        self.show = function () {
            var doneFuture = new BASE.async.Future.fromResult(null);
            if (!showing) {
                doneFuture = new BASE.async.Future(function (setValue, setError) {
                    observable.notify({ type: "show", options: options });
                    showing = true;
                    $wrapper.css({ "width": 0 });
                    $wrapper.animate({ "width": size + "px" }, 250, "easeOutExpo", function () {
                        setValue();
                    });
                });
            }
            return doneFuture.then();
        };

        self.hide = function () {
            var doneFuture = new BASE.async.Future.fromResult(null);
            if (showing) {
                doneFuture = new BASE.async.Future(function (setValue, setError) {
                    showing = false;
                    $wrapper.animate({ "width": "0" }, 250, "easeOutExpo", function () {
                        observable.notify({ type: "hide", options: options });
                        setValue();
                    });
                });
            }
            return doneFuture.then();
        };

        self.dispose = function () {
            var future = new BASE.async.Future.fromResult(null);
            if (showing) {
                future = self.hide();
            }

            future.then(function() {
                observable.getObservers().forEach(function (o) {
                    o.dispose();
                });
                $wrapper.remove();
            });
        };

        self.observeShow = function(callback) {
            return observable.observeType("show", callback);
        };

        self.observeHide = function(callback) {
            return observable.observeType("hide", callback);
        };

    };

    components.ui.layouts.UISidebarManager = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var veilCount = 0;
        var veilShowing = false;
        var widths = {"left": [], "right": [] };

        var defaults = {
            veil: true,
            level: 1,
            autoShow: true,
            size: 300,
            color: "#ffffff"
        };

        var mergeDefaults = function(options) {
            for (var i in defaults) {
                if (options[i] === undefined) {
                    options[i] = defaults[i];
                }
            }
        };

        var showVeil = function() {
            $(tags.veil).css({"opactiy": 0, "left":"0"});
            $(tags.veil).animate({ "opacity": 1 }, 250, "easeOutExpo");
            veilShowing = true;
        };

        var hideVeil = function() {
            $(tags.veil).animate({ "opacity": 0 }, 250, "easeOutExpo", function () {
                $(tags.veil).css({"left": "-100%" });
            });
            veilShowing = false;
        };

        var updateVeil = function() {
            if (veilCount === 1 && !veilShowing) {
                showVeil();
            } else if (veilCount === 0) {
                hideVeil();
            }
        };

        var updateWidths = function() {
            var leftWidth = widths.left.length === 0 ? 0 : Math.max.apply(Math, widths.left);
            var rightWidth = widths.right.length === 0 ? 0 : Math.max.apply(Math, widths.right);

            //$(tags["left-sidebar-container"]).animate({ "width": leftWidth + "px" }, 250, "easeOutExpo");
            //$(tags["right-sidebar-container"]).animate({ "width": rightWidth + "px" }, 250, "easeOutExpo");
            $(tags["left-sidebar-container"]).css({ "width": leftWidth + "px" });
            $(tags["right-sidebar-container"]).css({ "width": rightWidth + "px" });
        };


        self.createSidebar = function (content, options) {
            if (!(options && options.side)) {
                throw new Error("options.side required");
            }
            mergeDefaults(options);
            var newSidebar = new Sidebar(content, options);
            $(tags[options.side + "-sidebar-container"]).append(newSidebar.wrapper);
            newSidebar.observeShow(function (e) {
                widths[e.options.side].push(e.options.size);
                updateWidths();
                if (e.options.veil) {
                    veilCount += 1;
                    updateVeil();
                }
            });
            newSidebar.observeHide(function (e) {
                var sideWidths = widths[e.options.side];
                var widthIndex = sideWidths.indexOf(e.options.size);
                sideWidths.splice(widthIndex, 1);
                updateWidths();
                if (e.options.veil) {
                    veilCount -= 1;
                    updateVeil();
                }
            });
            if (options.autoShow) {
                newSidebar.show();
            }
            return newSidebar;
        };

        self.createLeftSidebar = function (content, options) {
            options = options || {};
            options.side = "left";
            return self.createSidebar(content, options);
        };

        self.createRightSidebar = function (content, options) {
            options = options || {};
            options.side = "right";
            return self.createSidebar(content, options);
        };

        $(tags['veil']).on("click", function () {
            $elem.trigger("veilClick");
        });
    };

});