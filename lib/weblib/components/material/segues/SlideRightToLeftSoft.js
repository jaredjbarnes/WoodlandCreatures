BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "BASE.async.Future"
], function () {
    BASE.namespace('components.material.segues');

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    components.material.segues.SlideRightToLeftSoft = function () {
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
                    easing: 'linear',
                    properties: {
                        opacity: {
                            from: 0.5,
                            to: 0
                        },
                        translateX: {
                            from: '0%',
                            to: '-100%'
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
                        translateX: {
                            from: '100%',
                            to: '0%'
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