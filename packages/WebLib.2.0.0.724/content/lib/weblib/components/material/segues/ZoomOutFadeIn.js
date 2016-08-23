BASE.require([
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "BASE.async.Future"
], function () {
    BASE.namespace('components.material.segues');

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    components.material.segues.ZoomOutFadeIn = function () {
        var self = this;
        var duration = 550;

        self.getDuration = function () {
            return duration;
        }

        self.executeAsync = function (outBoundElement, inboundElement) {

            var timeline = new PercentageTimeline(duration);

            if (outBoundElement) {
                var outboundElementAnimation = new ElementAnimation({
                    target: outBoundElement,
                    easing: 'easeOutExpo',
                    properties: {
                        opacity: {
                            from: 1,
                            to: 0
                        },
                        scaleX: {
                            from: 1,
                            to: .1
                        },
                        scaleY: {
                            from: 1,
                            to: .1
                        }
                    }
                });

                timeline.add({
                    animation: outboundElementAnimation,
                    startAt: 0,
                    endAt: 0.27
                });
            }

            if (inboundElement) {
                inboundElement.style.opacity = 0;

                var inboundElementAnimation = new ElementAnimation({
                    target: inboundElement,
                    easing: 'easeOutExpo',
                    properties: {
                        opacity: {
                            from: 0,
                            to: 1
                        },
                        scaleX: {
                            from: 1.5,
                            to: 1
                        },
                        scaleY: {
                            from: 1.5,
                            to: 1
                        },
                        rotateX: {
                            from: "0deg",
                            to: "0deg"
                        }
                    }
                });

                timeline.add({
                    animation: inboundElementAnimation,
                    startAt: 0.27,
                    endAt: 1
                });
            }

            var timelineFuture = timeline.playToEndAsync();

            return timelineFuture;
        };
    }
});