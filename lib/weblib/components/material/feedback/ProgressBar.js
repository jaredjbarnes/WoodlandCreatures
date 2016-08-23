BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation"
], function () {

    var ElementAnimation = BASE.web.animation.ElementAnimation;

    BASE.namespace("components.material.feedback");

    components.material.feedback.ProgressBar = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var bar = tags['bar'];
        var $bar = $(bar);
        var easing = 'easeOutQuad';
        var duration = 600;

        if ($elem.is('[bar-class]')) {
            var barClass = $elem.attr('bar-class');
            $bar.attr('class', barClass);
        };

        var createPercentageAnimation = function (value) {
            return new ElementAnimation({
                target: bar,
                easing: easing,
                properties: {
                    width: {
                        to: value + '%'
                    }
                },
                duration: duration
            });
        };

        var setDuration = function (time) {
            if (typeof (time) === 'number') {
                duration = time + 1;
            }
            else if (typeof (time) === 'undefined') {
                duration = 600;
            } else {
                throw new Error('The duration must be a number');
            }
        };

        self.setPercentageAsync = function (value, time) {
            setDuration(time);
            if (typeof value === 'number') {
                var percentageAnimation = createPercentageAnimation(value);
                return percentageAnimation.playToEndAsync();
            } else {
                throw new Error('The percentage must be a number');
            }
        };

        self.setDecimalFractionAsync = function (value, time) {
            setDuration(time);
            if (typeof value === 'number') {
                var wholeValue = value * 100;
                var percentageAnimation = createPercentageAnimation(wholeValue);
                return percentageAnimation.playToEndAsync();
            } else {
                throw new Error('The decimal fraction must be a number');
            }
        };
    };
});