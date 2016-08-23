BASE.require([
    'jQuery',
    'BASE.web.animation.ElementAnimation',
    'components.material.animations.createFadeInAnimation',
    'components.material.animations.createFadeOutAnimation',
    'BASE.web.animation.PercentageTimeline',
    'BASE.async.delayAsync'
], function () {
    BASE.namespace('components.material.inputs');

    var ElementAnimation = BASE.web.animation.ElementAnimation;

    var createFadeInAnimation = components.material.animations.createFadeInAnimation;
    var createFadeOutAnimation = components.material.animations.createFadeOutAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var delayAsync = BASE.async.delayAsync;
    var emptyFn = function () { };
    var DURATION = 400;

    var createScaleAnimation = function (iconBackground) {
        return new ElementAnimation({
            target: iconBackground,
            easing: "easeOutQuad",
            properties: {
                scaleX: {
                    from: 0.4,
                    to: 1
                },
                scaleY: {
                    from: 0.4,
                    to: 1
                }
            }
        });
    };

    components.material.inputs.IconButton = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var iconBackground = tags['icon-background']
        var $iconBackground = $(iconBackground);
        var backgroundFadeOutAnimation = createFadeOutAnimation(iconBackground);
        var backgroundFadeInAnimation = createFadeInAnimation(iconBackground);
        var isClick = true;

        var handleDefaultColors = function () {
            $iconBackground.removeAttr('class');
            $iconBackground.css({
                backgroundColor: ''
            });
            if ($elem.is('[background-color]')) {
                $iconBackground.css({
                    backgroundColor: $elem.attr('background-color')
                });
            }

            if ($elem.is('[background-class]')) {
                $iconBackground.attr('class', $elem.attr('background-class'));
            }
        };

        var scaleAnimation = createScaleAnimation(iconBackground);

        var offState = {
            click: function () {
                handleDefaultColors();
                if ($elem.is('[off-color]')) {
                    $iconBackground.css({
                        backgroundColor: $elem.attr('off-color')
                    });
                }
                if ($elem.is('[off-class]')) {
                    $iconBackground.attr('class', $elem.attr('off-class'));
                }
                toggleState = onState;
            }
        };

        var onState = {
            click: function () {
                handleDefaultColors();
                if ($elem.is('[on-color]')) {
                    $iconBackground.css({
                        backgroundColor: $elem.attr('on-color')
                    });
                }
                if ($elem.is('[on-class]')) {
                    $iconBackground.attr('class', $elem.attr('on-class'));
                }
                toggleState = offState;
            }
        }

        var toggleState = onState;

        var percentageTimeline = new PercentageTimeline(DURATION);

        percentageTimeline.add({
            animation: backgroundFadeInAnimation,
            startAt: 0,
            endAt: 1
        }, {
            animation: backgroundFadeOutAnimation,
            startAt: 0.5,
            endAt: 1
        }, {
            animation: scaleAnimation,
            startAt: 0,
            endAt: 0.5
        });

        var clickHandler = function (event) {
            event.stopImmediatePropagation();
            event.originalEvent.stopImmediatePropagation();

            toggleState.click();
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

        self.setStateOn = function () {
            toggleState = onState;
        };

        self.setStateOff = function () {
            toggleState = offState;
        };

        $elem.on('click', function (event) {
            clickHandler(event);
        });

        if ($elem.is('[start-on]')) {
            toggleState = offState;
        }
    };
});