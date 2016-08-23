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

    components.material.segues.SlideRightOut = function (duration) {
        var self = this;

        var duration = typeof duration === 'undefined' ? 150 : duration;

        self.getDuration = function () {
            return duration;
        }

        self.executeAsync = function (outBoundElement, inboundElement) {

            var timeline = new PercentageTimeline(duration);

            if (outBoundElement) {
                var outboundElementAnimation = new ElementAnimation({
                    target: outBoundElement,
                    easing: 'easeOutQuad',
                    properties: {
                        translateX: {
                            from: '0%',
                            to: '100%'
                        }
                    }
                });

                timeline.add({
                    animation: outboundElementAnimation,
                    startAt: 0,
                    endAt: 1
                });
            }

            var timelineFuture = timeline.playToEndAsync();

            return timelineFuture;
        };
    }
});