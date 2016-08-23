BASE.require([
    "core.effect.Scroller",
    "jQuery",
    "BASE.async.delay",
    "jQuery.fn.region",
    "jQuery.support.transform",
    "jQuery.event.special.mousewheel",
    "jQuery.fn.transition"
], function () {

    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;
    var delay = BASE.async.delay;
    var resizeTimeout = null;
    var helperElem = document.createElement("div");

    $(function () {
        $(window).resize(function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                $("[controller='components.ui.layouts.UIScroll']").each(function () {
                    var $scroll = $(this);

                    $scroll.controller().redraw();
                    $scroll.triggerHandler("resize");
                });
            }, 100); //Becarefull changing this value.  50 results in redundant resize calls on Chrome.
        });
    });

    var docStyle = document.documentElement.style;
    global = window;

    var engine;
    if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
        engine = 'presto';
    } else if ('MozAppearance' in docStyle) {
        engine = 'gecko';
    } else if ('WebkitAppearance' in docStyle) {
        engine = 'webkit';
    } else if (typeof navigator.cpuClass === 'string') {
        engine = 'trident';
    }

    var vendorPrefix = {
        trident: 'ms',
        gecko: 'Moz',
        webkit: 'Webkit',
        presto: 'O'
    }[engine];

    var perspectiveProperty = vendorPrefix + "Perspective";
    var transformProperty = vendorPrefix + "Transform";

    components.ui.layouts.UIScroll = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var content = tags["content"];
        var $content = $(content);

        var $xHandle = $(tags["xHandle"]);
        var $yHandle = $(tags["yHandle"]);

        var $xHandleBar = $(tags["xHandleBar"]);
        var $yHandleBar = $(tags["yHandleBar"]);

        var yHandle = $yHandle.controller();
        var xHandle = $xHandle.controller();

        var contentWidth = content.clientWidth;
        var contentHeight = content.clientHeight;
        var scrollingX;
        var scrollingY;
        var top = 0;
        var left = 0;
        var height = 0;
        var width = 0;
        var percentHeight = 1;
        var percentWidth = 1;
        var DEFAULT_HANDLE_SIZE = 25;
        var yHandleSize = DEFAULT_HANDLE_SIZE;
        var xHandleSize = DEFAULT_HANDLE_SIZE;
        var renderer;

        var mouseState = {
            scrollStart: function () { },
            scrollEnd: function () { }
        };

        var touchState = {
            scrollStart: function () {
                $yHandleBar.transition({
                    opacity: {
                        to: 1,
                        duration: 500
                    }
                });

                $xHandleBar.transition({
                    opacity: {
                        to: 1,
                        duration: 500
                    }
                });
            },
            scrollEnd: function () {
                $yHandleBar.transition({
                    opacity: {
                        to: 0,
                        duration: 500
                    }
                });

                $xHandleBar.transition({
                    opacity: {
                        to: 0,
                        duration: 500
                    }
                });
            }
        };

        var state = mouseState;

        var scrollHandlers = [];

        if ($elem.attr("scroll-x") === "false") {
            scrollingX = false;
        } else {
            scrollingX = true;
        }

        if ($elem.attr("scroll-y") === "false") {
            scrollingY = false;
        } else {
            scrollingY = true;
        }

        yHandle.setContainer($yHandleBar);
        xHandle.setContainer($xHandleBar);

        var reusableEvent = jQuery.Event("scroll");
        reusableEvent.top = 0;
        reusableEvent.left = 0;
        reusableEvent.zoom = 1;
        reusableEvent.preventDefault = function () { throw new Error("Cannot call this."); };
        reusableEvent.stopPropagation = function () { throw new Error("Cannot call this."); };

        if (helperElem.style[perspectiveProperty] !== undefined) {

            renderer = function (left, top, zoom) {
                content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
            };

        } else if (helperElem.style[transformProperty] !== undefined) {

            renderer = function (left, top, zoom) {
                content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
            };

        } else {

            renderer = function (left, top, zoom) {
                content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
                content.style.marginTop = top ? (-top / zoom) + 'px' : '';
                content.style.zoom = zoom || '';
            };

        }

        var touchStartEvent = {
            type: "scrollStart",
            origin: "touch"
        };

        var mouseWheelStartEvent = {
            type: 'scrollStart',
            origin: 'mouse'
        };

        var mouseStartEvent = {
            type: "scrollStart",
            origin: "mouse"
        };

        var attach = function () {
            var startX;
            var startY;

            var touchStart = function (e) {
                state = touchState;
                var touched = e.touches[0];
                startX = touched.pageX;
                startY = touched.pageY;
                scroller.doTouchStart(e.touches, e.timeStamp);
                state.scrollStart();
            };

            var touchMove = function (e) {
                var touched = e.touches[0];
                var moveX = Math.abs(startX - touched.pageX);
                var moveY = Math.abs(startY - touched.pageY);

                scroller.options.scrollingX = (moveX > moveY && moveX > 4) ? true : false;
                scroller.options.scrollingY = (moveY > moveX && moveY > 4) ? true : false;

                scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
                e.preventDefault();
            };

            var touchEnd = function (e) {
                scroller.doTouchEnd(e.timeStamp);
            };

            content.addEventListener("touchstart", touchStart, false);
            content.addEventListener("touchmove", touchMove, false);
            content.addEventListener("touchend", touchEnd, false);
            content.addEventListener("touchcancel", touchEnd, false);

            $(content).on("mousewheel", function (e) {
                state = mouseState;
                var wheelDeltaY = e.originalEvent.deltaY;
                var direction = wheelDeltaY / Math.abs(wheelDeltaY);
                scroller.scrollBy(0, direction * 90, true);
                state.scrollStart();
            });

        };

        var calculateScrollHandlePosition = function () {
            var scrollHeightPercent = top / (contentHeight - height);
            var positionY = (height - yHandleSize) * scrollHeightPercent;
            $yHandle.css({
                transform: "translate3d(0, " + positionY + "px, 0)"
            });

            var scrollWidthPercent = left / (contentWidth - width);
            var positionX = (width - xHandleSize) * scrollWidthPercent;
            $xHandle.css({
                transform: "translate3d(" + positionX + "px, 0, 0)"
            });
        };

        var calculateScrollHandleSize = function () {
            percentHeight = height / contentHeight;
            percentWidth = width / contentWidth;

            if (percentHeight * height < DEFAULT_HANDLE_SIZE) {
                self.showYScrollHandler();

                yHandleSize = DEFAULT_HANDLE_SIZE;
                $yHandle.css({
                    height: DEFAULT_HANDLE_SIZE + "px"
                });
            } else {
                yHandleSize = percentHeight * height;

                // Infinity happens when the content height is 0.
                if (percentHeight >= 1 || percentHeight === Infinity) {
                    self.hideYScrollHandler();
                } else {
                    self.showYScrollHandler();
                    $yHandle.css({
                        height: (percentHeight * 100) + "%"
                    });
                }
            }

            if (percentWidth * width < DEFAULT_HANDLE_SIZE) {
                self.showXScrollHandler();

                xHandleSize = DEFAULT_HANDLE_SIZE;
                $xHandle.css({
                    width: DEFAULT_HANDLE_SIZE + "px"
                });
            } else {
                xHandleSize = percentWidth * width;

                if (percentWidth >= 1 || percentWidth === Infinity) {
                    self.hideXScrollHandler();
                } else {
                    self.showXScrollHandler();
                    $xHandle.css({
                        width: (percentWidth * 100) + "%"
                    });
                }
            }
        };

        var scroller = new core.effect.Scroller(function (newLeft, newTop, zoom) {
            renderer(newLeft, newTop, zoom);

            top = newTop;
            left = newLeft;

            // This help on not garbage collecting small object.
            var event = reusableEvent;
            event.top = newTop;
            event.left = newLeft;
            event.zoom = zoom;

            calculateScrollHandlePosition();

            scrollHandlers.forEach(function (callback) {
                callback(event);
            });

        }, {
            scrollingX: scrollingX,
            scrollingY: scrollingY,
            bouncing: false,
            speedMultiplier: 1.35,
            scrollingComplete: function () {
                state.scrollEnd();
            }
        });

        self.redraw = function () {
            width = clientWidth = elem.clientWidth;
            height = clientHeight = elem.clientHeight;

            contentWidth = content.clientWidth;
            contentHeight = content.clientHeight;

            calculateScrollHandleSize();

            scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
        };

        self.appendContent = function (item) {
            if ($(item).parent().length === 0) {
                $content.append(item);
            }
        };

        self.hideXScrollHandler = function () {
            $xHandleBar.addClass('hide');
        };

        self.hideYScrollHandler = function () {
            $yHandleBar.addClass('hide');
        };

        self.showXScrollHandler = function () {
            $xHandleBar.removeClass('hide');
        };

        self.showYScrollHandler = function () {
            $yHandleBar.removeClass('hide');
        };

        self.onScroll = function (callback) {
            if (typeof callback === "function") {
                scrollHandlers.push(callback);
            }
        };

        self.setXHandleHeight = function (height) {
            $xHandleBar.height(height);
            $xHandle.height(height);
        };

        self.setYHandleWidth = function (width) {
            $yHandleBar.width(width);
            $yHandle.width(width);
        }

        Object.defineProperties(self, {
            top: {
                get: function () {
                    return top;
                },
                set: function (value) {
                    scroller.scrollTo(self.left, value);
                }
            },
            left: {
                get: function () {
                    return left;
                },
                set: function (value) {
                    scroller.scrollTo(value, self.top);
                }
            },
            width: {
                get: function () {
                    //if (width === 0) {
                    //    width = elem.clientWidth;
                    //}
                    return elem.clientWidth;
                }
            },
            height: {
                get: function () {
                    //if (height === 0) {
                    //    height = elem.clientHeight;
                    //}
                    return elem.clientHeight;
                }
            },
            contentHeight: {
                get: function () {
                    return contentHeight;
                },
                set: function (value) {
                    content.style.height = value;
                    self.redraw();
                }
            },
            contentWidth: {
                get: function () {
                    return contentWidth;
                },
                set: function (value) {
                    content.style.width = value;
                    self.redraw();
                }
            },
            scrollX: {
                get: function () {
                    return scroller.options.scrollingX;
                },
                set: function (value) {
                    if (typeof value === "boolean") {
                        scroller.options.scrollingX = value;
                    }
                }

            },
            scrollY: {
                get: function () {
                    return scroller.options.scrollingY;
                },
                set: function (value) {
                    if (typeof value === "boolean") {
                        scroller.options.scrollingY = value;
                    }
                }
            }

        });

        self.setOverflow = function (overflow) {
            $elem.css("overflow", overflow);
        };

        self.showXScrollHandler();
        self.showYScrollHandler();

        $elem.on('mouseenter', function () {
            $yHandleBar.transition({
                opacity: {
                    to: 1,
                    duration: 500
                }
            });
            $xHandleBar.transition({
                opacity: {
                    to: 1,
                    duration: 500
                }
            });
        });

        $elem.on('mouseleave', function () {
            $yHandleBar.transition({
                opacity: {
                    to: 0,
                    duration: 500
                }
            });
            $xHandleBar.transition({
                opacity: {
                    to: 0,
                    duration: 500
                }
            });
        });

        $yHandle.on("dragging", function (e) {
            var yhandlePosition = e.boundingBox.top - $elem[0].getBoundingClientRect().top;
            var scrollableHeight = (height - yHandleSize);
            var scrollYPercent = yhandlePosition / scrollableHeight;
            var top = scrollYPercent * (contentHeight - height);

            scroller.scrollTo(self.left, top);
        });

        $xHandle.on("dragging", function (e) {
            var xhandlePosition = e.boundingBox.left - $elem[0].getBoundingClientRect().left;
            var scrollableWidth = (width - xHandleSize);
            var scrollXPercent = xhandlePosition / scrollableWidth;
            var left = scrollXPercent * (contentWidth - width);

            scroller.scrollTo(left, self.top);
        });

        if ($elem.attr("overflow") && $elem.attr("overflow") === "visible") {
            self.setOverflow("visible");
        }

        attach();

        setTimeout(function () {
            self.redraw();
        }, 0);

    };

});