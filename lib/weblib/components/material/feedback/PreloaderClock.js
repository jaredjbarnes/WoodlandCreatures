BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline"
], function () {
    BASE.namespace("components.material.feedback");

    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    var createSpinAnimation = function (elem, duration) {
        var animation = new ElementAnimation({
            target: elem,
            properties: {
                rotateZ: {
                    from: "0deg",
                    to: "720deg"
                }
            },
            duration: duration,
            easing: "linear"
        });

        animation.repeat = Infinity;
        return animation;
    };

    var createIntroductionAnimation = function (elem, duration) {
        var position = new ElementAnimation({
            target: elem,
            properties: {
                translateY: {
                    from: "100%",
                    to: "0px"
                }
            },
            easing: "easeOutElastic"
        });

        var opacity = new ElementAnimation({
            target: elem,
            properties: {
                opacity: {
                    from: 0,
                    to: 1
                }
            }
        });

        var timeline = new PercentageTimeline(duration);

        timeline.add({
            animation: position,
            startAt: 0,
            endAt: 1
        }, {
            animation: opacity,
            startAt: 0,
            endAt: 0.5
        });

        return timeline;
    };

    components.material.feedback.PreloaderClock = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $clock = $(tags["clock"]);
        var $hourHandle = $(tags["hour-handle"]);
        var $minuteHandle = $(tags["minute-handle"]);
        var $center = $(tags['center']);

        var computedWidth = $hourHandle.width();

        $clock.css('border-width', computedWidth + 'px');
        $hourHandle.add($minuteHandle).css('border-radius', computedWidth + 'px');

        var hourAnimation = createSpinAnimation(tags["hour"], 80000);
        var minuteAnimation = createSpinAnimation(tags["minute"], 8000);
        var introductionAnimation = createIntroductionAnimation($clock[0], 2000);

        self.stop = function () {
            introductionAnimation.stop();
            hourAnimation.stop();
            minuteAnimation.stop();
        };

        self.play = function () {
            introductionAnimation.play();
            hourAnimation.play();
            minuteAnimation.play();
        };

        self.restart = function () {
            introductionAnimation.restart();
            hourAnimation.restart();
            minuteAnimation.restart();
        };

        if ($elem.is('[color]')) {
            var color = $elem.attr('color');
            $clock.css('border-color', color);
            $hourHandle.add($minuteHandle).css('background-color', color);
            $center.css('background-color', color);
        }

        if ($elem.is('[border-class]')) {
            $clock.addClass($elem.attr('border-class'));
        }

        if ($elem.is('[background-class]')) {
            $hourHandle.add($minuteHandle).add($center).addClass($elem.attr('background-class'));
        }

        if ($elem.is('[auto-play]')) {
            self.play();
        }
    };
});