BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "jQuery.fn.region",
    "components.material.animations.createFadeOutAnimation",
    "BASE.web.animation.PercentageTimeline",
    "requestAnimationFrame",
    "BASE.async.delayAsync"
], function () {

    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var createFadeOutAnimation = components.material.animations.createFadeOutAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var delayAsync = BASE.async.delayAsync;
    var emptyFn = function () { };
    var DURATION = 400;

    BASE.namespace("components.material.inputs");

    components.material.inputs.MaterialButtonBehavior = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var ripple = tags['ripple'];
        var $ripple = $(ripple);
        var rippleFadeOutAnimation = createFadeOutAnimation(ripple);
        var percentageTimeline = new PercentageTimeline(DURATION);
        var isClick = true;

        var rippleAnimation = new ElementAnimation({
            target: ripple,
            easing: "easeOutQuad",
            properties: {
                scaleX: {
                    from: 0,
                    to: 1
                },
                scaleY: {
                    from: 0,
                    to: 1
                },
            }
        });

        percentageTimeline.add({
            animation: rippleAnimation,
            startAt: 0,
            endAt: 1
        });

        percentageTimeline.add({
            animation: rippleFadeOutAnimation,
            startAt: 0.25,
            endAt: 1
        });

        var clickHandler = function (event) {
            event.stopImmediatePropagation();
            event.originalEvent.stopImmediatePropagation();

            var region = $elem.region();
            var x = event.pageX - region.left;
            var y = event.pageY - region.top;

            requestAnimationFrame(function () {
                $ripple.css({
                    top: y + 'px',
                    left: x + 'px',
                    marginTop: '-150px',
                    marginLeft: '-150px',
                    opacity: '1'
                });
            });

            percentageTimeline.restart();

            if (isClick) {
                isClick = false;
                delayAsync(DURATION).then(function () {
                    var tempClickHandler = clickHandler;
                    clickHandler = emptyFn;
                    $elem.trigger('click');
                    clickHandler = tempClickHandler;
                    isClick = true;
                });
            }
        };

        $elem.on('click', function (event) {
            clickHandler(event);
        });
    };

});