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

    components.material.segues.SlideLeftIn = function () {
        var self = this;

        var duration = typeof duration === 'undefined' ? 550 : duration;

        self.getDuration = function () {
            return duration;
        }

        self.executeAsync = function (outBoundElement, inboundElement) {

            var timeline = new PercentageTimeline(duration);

            if (inboundElement) {
                var inboundElementAnimation = new ElementAnimation({
                    target: inboundElement,
                    easing: 'easeOutExpo',
                    properties: {
                        translateX: {
                            from: '100%',
                            to: '0%'
                        }
                    }
                });

                timeline.add({
                    animation: inboundElementAnimation,
                    startAt: 0,
                    endAt: 1
                });
            }

            var timelineFuture = timeline.playToEndAsync();

            return timelineFuture;
        };
    }
});