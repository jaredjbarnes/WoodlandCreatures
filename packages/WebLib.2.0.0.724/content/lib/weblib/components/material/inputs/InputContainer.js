BASE.require([
    'jQuery',
    'components.material.inputs.Validator',
    'BASE.web.animation.ElementAnimation',
    'BASE.web.animation.PercentageTimeline'
], function () {
    BASE.namespace('components.material.inputs');

    var Validator = components.material.inputs.Validator;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var emptyFn = function () { };

    components.material.inputs.InputContainer = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);

        Validator.call(self);

        var $labelContainer = $(tags['label-container']);
        var $inputContainer = $(tags['input-container']);
        var $helperContainer = $(tags['helper-container']);
        var $label = $labelContainer.children('[selector="label"]');
        var $helper = $helperContainer.children('[selector="helper"]');
        var $input = $inputContainer.children('[selector="input"]');
        var $inputComponent = $inputContainer.children('[selector="input-component"]');
        var inputState = {};

        $label = $label.length === 0 ? $labelContainer : $label;
        $helper = $helper.length === 0 ? $helperContainer : $helper;

        var $labelInner = $label.wrapInner('<div></div>').children();

        if ($input.length > 0) {
            $input = $inputContainer.find('input, select, textarea');

            if ($input.length === 0) {
                throw new Error('An input must be provided for the container to work.');
            };

            inputState = {
                getValue: function () {
                    return $input.val();
                },
                setValue: function (value) {
                    $input.val(value);
                }
            }
        } else if ($inputComponent.length > 0) {
            $input = $inputComponent;
            var inputController = $input.controller();

            if (!inputController || !inputController.getValue || !inputController.setValue) {
                throw new Error('An input component controller must be provided with a getValue and setValue method.');
            }

            inputState = {
                getValue: function () {
                    return inputController.getValue();
                },
                setValue: function (value) {
                    inputController.setValue(value);
                }
            };
        } else {
            throw new Error('A selctor of either input or input-component is required');
        }

        var helperHtml = $helper.html();

        var clearStyles = function () {
            $label.add($helper).add($input).removeClass(function () {
                return $(this).attr('focus-class') + ' ' + $(this).attr('error-class') + ' text-danger text-info border-info border-danger';
            });
        };

        var labelAnimationTimeline = new PercentageTimeline(200);

        var labelContainerAnimation = new ElementAnimation({
            target: $labelContainer[0],
            easing: "easeOutQuad",
            properties: {
                translateY: {
                    from: '0%',
                    to: '-100%'
                },
            }
        });

        var labelInnerAnimation = new ElementAnimation({
            target: $labelInner[0],
            easing: "easeOutQuad",
            properties: {
                fontSize: {
                    from: '1em',
                    to: '0.86em'
                }
            }
        });

        labelAnimationTimeline.add({
            animation: labelContainerAnimation,
            startAt: 0,
            endAt: 1
        });

        labelAnimationTimeline.add({
            animation: labelInnerAnimation,
            startAt: 0,
            endAt: 1
        });

        var animateLabelState = {
            play: function () {
                labelAnimationTimeline.play();
            },
            reverse: function () {
                labelAnimationTimeline.reverse();
            },
            seek: function (value) {
                labelAnimationTimeline.seek(value).render();
            }
        };

        var plainLabelState = {
            play: emptyFn,
            reverse: emptyFn,
            seek: emptyFn
        };

        var labelState = plainLabelState;

        var hasValue = function () {
            var inputCurrentValue = inputState.getValue();
            return inputCurrentValue !== null && typeof inputCurrentValue !== 'undefined' && inputCurrentValue !== '';
        };

        var init = function () {
            if (hasValue()) {
                labelState.seek(1);
            }
        };

        if ($elem.is('[float-label]')) {
            labelState = animateLabelState;
        }

        var setUnfocus = function () {
            clearStyles();
            $helper.html(helperHtml);

            if (hasValue()) {
                labelState.seek(1);
            } else {
                labelState.reverse();
            }
        };

        var setFocus = function () {
            clearStyles();
            $label.add($helper).addClass(function () {
                return $(this).attr('focus-class') || 'text-info';
            });
            $input.addClass(function () {
                return $(this).attr('focus-class') || 'border-info';
            });
            labelState.play();
        };

        var focusHandler = function (event) {
            event.stopPropagation();
            setFocus();
        };

        var blurHandler = function (event) {
            event.stopPropagation();
            setUnfocus();
        };

        self.setError = function (message) {
            clearStyles();
            $label.add($helper).addClass(function () {
                return $(this).attr('error-class') || 'text-danger';
            });
            $input.addClass(function () {
                return $(this).attr('error-class') || 'border-danger';
            });
            $helper.html(message);
        };

        self.getValue = function () {
            return inputState.getValue();
        };

        self.setValue = function (value) {
            inputState.setValue(value);
            setUnfocus();
        };

        $input.on("click", function (event) {
            event.stopPropagation();
        });

        $elem.on("click", function () {
            $input.focus();
            $input.trigger('clickComponentFocus');
        });

        $input.on('focus componentFocus', focusHandler);

        $input.on('blur componentBlur', blurHandler);

        init();
    };
});