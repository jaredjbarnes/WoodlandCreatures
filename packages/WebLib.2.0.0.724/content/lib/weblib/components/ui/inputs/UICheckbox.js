BASE.require([
    "jQuery",
    "jQuery.fn.transition",
], function () {
    BASE.namespace("components.ui.inputs");

    var Future = BASE.async.Future;

    components.ui.inputs.UICheckbox = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $squareBlank = $(tags['square-blank']);
        var $ok = $(tags['ok']);
        var $labelBefore = $(tags['label-before']);
        var $labelAfter = $(tags['label-after']);

        var assertOptions = function (options) {
            options = options || {};
            options.duration = options.duration === undefined ? 150 : options.duration;
            return options;
        };

        var checkedState = {
            toggle: function (options) {
                state = uncheckedState;

                return new Future(function (setValue, setError) {
                    options = assertOptions(options);
                    var duration = options.duration;

                    if (duration !== 0) {
                        $ok.transition({
                            transform: {
                                to: 'scale(0)',
                                duration: duration,
                                easing: 'ease'
                            }
                        }).then(function () {
                            $ok.addClass('hide');
                            $squareBlank.removeClass('hide');
                            $squareBlank.transition({
                                transform: {
                                    from: 'rotate(90deg) scale(0)',
                                    to: 'rotate(0deg) scale(1)',
                                    duration: duration,
                                    easing: 'ease'
                                }
                            }).then(setValue);
                        });
                    }
                    else {
                        $ok.addClass('hide');
                        $squareBlank.removeClass('hide');
                        $squareBlank.css({
                            transform: "rotate(0deg) scale(1)"
                        });
                        setValue();
                    }
                }).then();
            }
        };

        var uncheckedState = {
            toggle: function (options) {
                state = checkedState;

                return new Future(function (setValue, setError) {
                    options = assertOptions(options);
                    var duration = options.duration;

                    if (duration !== 0) {
                        $squareBlank.transition({
                            transform: {
                                to: 'rotate(90deg) scale(0)',
                                duration: duration,
                                easing: 'ease'
                            }
                        }).then(function () {
                            $squareBlank.addClass('hide');
                            $ok.removeClass('hide');
                            $ok.transition({
                                transform: {
                                    from: 'scale(0)',
                                    to: 'scale(1)',
                                    duration: duration,
                                    easing: 'ease'
                                }
                            }).then(setValue);
                        });
                    } else {
                        $squareBlank.addClass('hide');
                        $ok.removeClass('hide');
                        $ok.css({
                            transform: "scale(1)"
                        });
                        setValue();
                    }
                }).then();
            }
        };

        var state = uncheckedState;

        if ($elem.is('.danger')) {
            $ok.addClass('text-danger');
        }

        if ($elem.is('.success')) {
            $ok.addClass('text-success');
        }

        if ($elem.is('.info')) {
            $ok.addClass('text-info');
        }

        if ($elem.is('.primary')) {
            $ok.addClass('text-primary');
        }

        self.toggle = function (options) {
            return state.toggle(options);
        }

        self.check = function (options) {
            state = uncheckedState;
            return self.toggle(options);
        }

        self.uncheck = function (options) {
            state = checkedState;
            return self.toggle(options);
        }

        self.reset = function () {
            self.uncheck();
        }

        self.isChecked = function () {
            return state === checkedState;
        }

        if ($elem.is('[checked]')) {
            state.toggle({ duration: 0 });
        }

        if ($elem.is('[label-after]')) {
            $labelBefore.addClass('hide');
            $labelAfter.removeClass('hide');
            $labelAfter.text($elem.attr('label'));
        } else {
            $labelBefore.removeClass('hide');
            $labelAfter.addClass('hide');
            $labelBefore.text($elem.attr('label'));
        }

        $elem.on('click', function () {
            self.toggle();
        });

    };
});