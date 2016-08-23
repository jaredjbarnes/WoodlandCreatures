BASE.require([
    "jQuery"
], function () {

    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;
    var delay = BASE.async.delay;
    var resizeTimeout = null;

    $(function () {
        $(window).resize(function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                $("[controller='components.ui.layouts.DesktopScroll']").each(function () {
                    var $scroll = $(this);

                    $scroll.controller().clearCache();
                    $scroll.triggerHandler("resize");
                });
            }, 50);
        });
    });

    components.ui.layouts.DesktopScroll = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $content = $(tags["content"]);
        var scrollHandlers = [];

        var reusableEvent = jQuery.Event("scroll");
        var cachedWidth = 0;
        var cachedHeight = 0;
        var cachedScrollTop = 0;
        var cachedScrollLeft = 0;

        reusableEvent.top = 0;
        reusableEvent.left = 0;
        reusableEvent.zoom = 1;
        reusableEvent.preventDefault = function () { throw new Error("Cannot call this."); };
        reusableEvent.stopPropagation = function () { throw new Error("Cannot call this."); };


        self.onScroll = function (callback) {
            if (typeof callback === "function") {
                scrollHandlers.push(callback);
            }
        };

        self.appendContent = function (item) {
            if ($(item).parent().length === 0) {
                $content.append(item);
            }
        };

        self.clearDimensionCache = function () {
            cachedHeight = 0;
            cachedWidth = 0;
        };

        self.clearPositionCache = function () {
            cachedScrollLeft = elem.scrollLeft;
            cachedScrollTop = elem.scrollTop;
        };

        self.clearCache = function () {
            self.clearDimensionCache();
            self.clearPositionCache();
        };

        Object.defineProperties(self, {
            top: {
                get: function () {
                    return cachedScrollTop;
                },
                set: function (position) {
                    cachedScrollTop = position;
                    $elem.scrollTop(position);
                }
            },
            left: {
                get: function () {
                    return cachedScrollLeft;
                },
                set: function (position) {
                    cachedScrollLeft = position;
                    $elem.scrollLeft(position);
                }
            },
            contentWidth: {
                get: function () {
                    return $content.width();
                },
                set: function (width) {
                    $content.css("width", width);
                }
            },
            contentHeight: {
                get: function () {
                    if (cachedHeight === 0) {
                        cachedHeight = $content.height();
                    }
                    return cachedHeight;
                },
                set: function (height) {
                    $content.css("height", height);
                }
            },
            width: {
                get: function () {
                    if (cachedWidth === 0) {
                        cachedWidth = $content.width();
                    }
                    return cachedWidth;
                },
                set: function (width) {
                    $elem.css("width", width);
                }
            },
            height: {
                get: function () {
                    return $elem.height();
                },
                set: function (height) {
                    $elem.css("height", height);
                }
            },
            scrollX: {
                get: function () {
                    return $elem.css("overflow-x") === "scroll";
                },
                set: function (canScroll) {
                    if (canScroll) {
                        $elem.css("overflow-x", "scroll");
                    } else {
                        $elem.css("overflow-x", "hidden");
                    }
                }
            },
            scrollY: {
                get: function () {
                    return $elem.css("overflow-y") === "scroll";
                },
                set: function (canScroll) {
                    if (canScroll) {
                        $elem.css("overflow-y", "scroll");
                    } else {
                        $elem.css("overflow-y", "hidden");
                    }
                }
            }
        });

        $elem.on("scroll", function () {
            // This help on not garbage collecting small object.
            var event = reusableEvent;
            cachedScrollTop = event.top = elem.scrollTop;
            cachedScrollLeft = event.left = elem.scrollLeft;
            event.zoom = 1;

            scrollHandlers.forEach(function (callback) {
                callback(event);
            });

        });

    };
});