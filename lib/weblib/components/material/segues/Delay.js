BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "BASE.async.Future",
    "BASE.async.Delay"
], function () {
    BASE.namespace('components.material.segues');

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    components.material.segues.Delay = function (obj) {
        var self = this;
        var duration = obj.duration || 1000;

        self.getDuration = function () {
            return duration;
        }

        self.executeAsync = function (outBoundElement, inboundElement) {
            return BASE.async.Delay(duration);
        };
    }
});