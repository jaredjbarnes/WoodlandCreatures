BASE.require([
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "BASE.async.Future"
], function () {
    BASE.namespace('components.material.segues');

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    components.material.segues.FadeOutToInert = function (duration) {
        var self = this;

        if (typeof duration === 'undefined' || duration === null) {
            duration = 150;
        }

        self.getDuration = function () {
            return duration;
        };

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
                        }
                    }
                });

                timeline.add({
                    animation: outboundElementAnimation,
                    startAt: 0,
                    endAt: 1
                });
            };

            var timelineFuture = timeline.playToEndAsync();

            return timelineFuture;
        };
    }
});