BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "BASE.async.Fulfillment",
    "jQuery.fn.region"
], function () {
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var Fulfillment = BASE.async.Fulfillment;
    var Future = BASE.async.Future;
    var emptyFn = function () { };

    var recoverFuture = function (future) {
        return future["catch"](emptyFn).catchCanceled(emptyFn);
    };

    BASE.namespace("components.material.layouts");

    components.material.layouts.TooltipManager = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $message = $(tags["message"]);
        var $tooltip = $(tags["tooltip"]);
        var lastPositionFuture = Future.fromResult();

        var showMessageAsync = function (options) {
            var options = options || {};
            var shouldSlide = typeof options.slide === "boolean" ? options.slide : true;
            var duration = typeof options.duration === "number" ? options.duration : 500;

            var opacityAnimation = new ElementAnimation({
                target: tags["tooltip"],
                properties: {
                    opacity: {
                        from: 0,
                        to: 1
                    }
                }
            });

            var timeline = new PercentageTimeline(duration);
            timeline.add({
                animation: opacityAnimation,
                startAt: 0,
                endAt: 1
            });

            if (shouldSlide) {
                addSlideAnimation(timeline);
            }

            return timeline.playToEndAsync();
        };

        var addSlideAnimation = function (timeline) {
            var translateYAnimation = new ElementAnimation({
                target: tags["tooltip"],
                properties: {
                    translateY: {
                        from: "50px",
                        to: "0px"
                    }
                },
                easing: "easeOutExpo"
            });

            timeline.add({
                animation: translateYAnimation,
                startAt: 0,
                endAt: 1
            });
        };

        var hideMessageAsync = function (options) {
            var options = options || {};
            var duration = typeof options.duration === "number" ? options.duration : 500;

            var opacityAnimation = new ElementAnimation({
                target: tags["tooltip"],
                properties: {
                    opacity: {
                        from: 1,
                        to: 0
                    }
                },
                duration: duration
            });

            return opacityAnimation.playToEndAsync();
        };

        self.showTooltipAsync = function (options) {
            var position = options.position;
            var messageElement = options.messageElement;
            var message = options.message;
            var width = options.width;
            lastPositionFuture.cancel();
            return lastPositionFuture = recoverFuture(lastPositionFuture).chain(function () {
                $message.empty();
                if (messageElement) {
                    $message.append(messageElement);
                } else {
                    $message.text(message);
                }

                $tooltip.css({
                    display: "block",
                    transform: "translateY(0)",
                    width: width || ""
                });

                var height = $tooltip.region().height;
                position.top = position.top - (height / 2);
                position.left = position.left + 20;
                $tooltip.offset(position);

                return showMessageAsync(options);
            });
        };

        self.hideTooltipAsync = function (options) {
            return lastPositionFuture = recoverFuture(lastPositionFuture).chain(function () {
                return hideMessageAsync(options).finally(function () {
                    $tooltip.css({
                        display: "none"
                    });
                });
            });
        };

        self.updateTooltipPosition = function (position) {
            var height = $tooltip.region().height;
            position.top = position.top - (height / 2);
            position.left = position.left + 20;
            $tooltip.offset(position);
        };

        $elem.on("tooltip", function (event) {
            var $tooltipTarget = $(event.tooltipTarget);

            if ($tooltipTarget.length > 0) {
                $elem.off('mousemove').on('mousemove', function () {
                    if ($elem.find($tooltipTarget).length === 0) {
                        self.hideTooltipAsync()["try"]();
                        $elem.off('mousemove');
                    }
                });
            }

            if (!(event.tooltipManagerAsync instanceof Fulfillment)) {
                throw new Error("The event needs to have a Fulfillment on the tootipManager property.");
            }

            event.tooltipManagerAsync.setValue({
                showAsync: function (options) {
                    return self.showTooltipAsync(options);
                },
                hideAsync: function (options) {
                    return self.hideTooltipAsync(options);
                },
                updatePosition: function (position) {
                    return self.updateTooltipPosition(position);
                }
            });
            return false;
        });

    };
});