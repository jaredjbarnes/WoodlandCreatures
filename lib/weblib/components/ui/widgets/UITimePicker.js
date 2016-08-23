BASE.require([
    "jQuery",
    "jQuery.support.transform",
    "jQuery.fn.transition"
], function () {
    BASE.namespace("components.ui.widgets");

    components.ui.widgets.UITimePicker = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $clockContainer = $(tags['clock-container']);
        var $clock = $(tags['clock']);
        var $clockChildren = $clock.children().find('span');
        var $exactTime = $(tags['exact-time']);
        var $time = $(tags['time']);
        var $hours = $(tags['hours']);
        var $minutes = $(tags['minutes']);
        var $minutesFirstNumber = $minutes.find('.first-number');
        var $minutesSecondNumber = $minutes.find('second-number');
        var $secondsSeparator = $(tags['seconds-separator']);
        var $seconds = $(tags['seconds']);
        var $secondsFirstNumber = $seconds.find('.first-number');
        var $secondsSecondNumber = $seconds.find('second-number');
        var $period = $(tags['period']);
        var $am = $(tags['am']);
        var $pm = $(tags['pm']);
        var $keypad = $(tags['keypad']);
        var $hr = $(tags['hr']);
        var $min = $(tags['min']);
        var keypadState = 1;

        if ($.support.transform) {
            $clock.addClass('transform-supported');
        }

        if ($elem.is('[seconds]')) {
            $secondsSeparator.removeClass('hide');
            $seconds.removeClass('hide');
        }

        var setActiveClockNumber = function (value) {
            $clockChildren.removeClass('text-primary');
            $clockChildren.filter(function () {
                var $this = $(this);
                return $.trim($this.text()) === value;
            }).addClass('text-primary');
        }

        var hideKeypad = function () {
            $keypad.transition({
                transform: {
                    to: 'scale(0)',
                    ease: 'easeOutExpo',
                    duration: 200
                }
            }).then(function () {
                $keypad.addClass('invisible');
            });
            keypadState = 1;
            $keypad.find('.second-only').attr('disabled', '');
            $time.find('.keypad-first').removeClass('keypad-first');
            $time.find('.keypad-second').removeClass('keypad-second');
        }

        self.reset = function () {
            $hours.trigger('click');
        }

        self.setTime = function (time) {
            if (time instanceof Date) {
                var hours = time.getHours();
                var minutes = time.getMinutes();
                var seconds = time.getSeconds();
            }
            else {
                var hours = time.hours;
                var minutes = time.minutes;
                var seconds = time.seconds;
            }

            $period.text(hours >= 12 ? 'PM' : 'AM');
            hours = hours % 12;
            hours = hours ? hours : 12;
            $hours.text(hours);
            minutes = minutes < 10 ? '0' + minutes : minutes;
            $minutesFirstNumber.text(minutes[0]);
            $minutesSecondNumber.text(minutes[1]);
            seconds = seconds < 10 ? '0' + seconds : seconds;
            if ($seconds.is(':visible')) {
                $secondsFirstNumber.text(seconds[0]);
                $secondsSecondNumber.text(seconds[1]);
            }
            $hours.trigger('click');
        };

        self.getTime = function () {
            var time = {}
            var hours = parseInt($hours.text(), 10);
            if ($period.text() === 'AM') {
                if (hours === 12) {
                    hours = 0;
                }
            }
            else {
                if (hours !== 12) {
                    hours = hours + 12;
                }
            }
            time.hours = hours;
            time.minutes = parseInt($minutes.text(), 10);
            time.seconds = parseInt($seconds.text(), 10);
            return time;
        }

        $keypad.find('[ui-button]').on('click', function () {
            var $this = $(this);
            var $active = $time.find('.text-primary');
            var value = parseInt($this.text(), 10);
            if (keypadState === 2) {
                var $currentPosition = $active.find('.second-number');
                $currentPosition.text(value);
                hideKeypad();
                if ($seconds.is(':visible')) {
                    $seconds.trigger('click');
                }
                else {
                    $minutes.trigger('click');
                }
            }
            else if (value < 6) {
                var $currentPosition = $active.find('.first-number');
                $currentPosition.text(value);
                $keypad.find('.second-only').removeAttr('disabled');
                keypadState = 2;
                $active.removeClass('keypad-first').addClass('keypad-second');
            }
        });

        $hours.on('click', function () {
            hideKeypad();
            $exactTime.addClass('invisible');

            $hours.transition({
                transform: {
                    to: 'scale(0.8)',
                    easing: 'easeOutExpo',
                    duration: 200
                }
            }).then(function () {
                $hours.transition({
                    transform: {
                        to: 'scale(1)',
                        easing: 'easeOutExpo',
                        duration: 200
                    }
                });
            });

            $clock.find('.minutes-seconds').each(function () {
                var $this = $(this);
                var translateString = '';
                translateString = $this.is('.twelve') ? 'translate3d(0, 100%, 0)' : translateString;
                translateString = $this.is('.one') ? 'translate3d(-40%, 120%, 0)' : translateString;
                translateString = $this.is('.two') ? 'translate3d(-100%, 80%, 0)' : translateString;
                translateString = $this.is('.three') ? 'translate3d(-100%, 0, 0)' : translateString;
                translateString = $this.is('.four') ? 'translate3d(-100%, -80%, 0)' : translateString;
                translateString = $this.is('.five') ? 'translate3d(-40%, -120%, 0)' : translateString;
                translateString = $this.is('.six') ? 'translate3d(0, -100%, 0)' : translateString;
                translateString = $this.is('.seven') ? 'translate3d(40%, -120%, 0)' : translateString;
                translateString = $this.is('.eight') ? 'translate3d(100%, -80%, 0)' : translateString;
                translateString = $this.is('.nine') ? 'translate3d(100%, 0, 0)' : translateString;
                translateString = $this.is('.ten') ? 'translate3d(100%, 80%, 0)' : translateString;
                translateString = $this.is('.eleven') ? 'translate3d(40%, 120%, 0)' : translateString;
                $this.transition({
                    opacity: {
                        to: '0',
                        easing: 'easeOutExpo',
                        duration: 500
                    },
                    transform: {
                        to: translateString,
                        easing: 'easeOutExpo',
                        duration: 500
                    }
                }).then(function () {
                    $this.addClass('invisible');
                });
            });
            $clock.find('.hours').removeClass('invisible').each(function () {
                var $this = $(this);
                $this.transition({
                    opacity: {
                        to: '1',
                        easing: 'easeOutExpo',
                        duration: 500
                    },
                    transform: {
                        to: 'translate3d(0, 0, 0)',
                        easing: 'easeOutExpo',
                        duration: 500
                    }
                });
            });
            $time.find('.text-primary').removeClass('text-primary');
            $hours.addClass('text-primary');
            setActiveClockNumber($hours.text());
        });

        $minutes.add($seconds).on('click', function () {
            var $this = $(this);
            hideKeypad();
            $exactTime.removeClass('invisible');

            $this.transition({
                transform: {
                    to: 'scale(0.8)',
                    easing: 'easeOutExpo',
                    duration: 200
                }
            }).then(function () {
                $this.transition({
                    transform: {
                        to: 'scale(1)',
                        easing: 'easeOutExpo',
                        duration: 200
                    }
                });
            });

            $clock.find('.hours').each(function () {
                var $this = $(this);
                var translateString = '';
                translateString = $this.is('.twelve') ? 'translate3d(0, -100%, 0)' : translateString;
                translateString = $this.is('.one') ? 'translate3d(40%, -120%, 0)' : translateString;
                translateString = $this.is('.two') ? 'translate3d(100%, -80%, 0)' : translateString;
                translateString = $this.is('.three') ? 'translate3d(100%, 0, 0)' : translateString;
                translateString = $this.is('.four') ? 'translate3d(100%, 80%, 0)' : translateString;
                translateString = $this.is('.five') ? 'translate3d(40%, 120%, 0)' : translateString;
                translateString = $this.is('.six') ? 'translate3d(0, 100%, 0)' : translateString;
                translateString = $this.is('.seven') ? 'translate3d(-40%, 120%, 0)' : translateString;
                translateString = $this.is('.eight') ? 'translate3d(-100%, 80%, 0)' : translateString;
                translateString = $this.is('.nine') ? 'translate3d(-100%, 0, 0)' : translateString;
                translateString = $this.is('.ten') ? 'translate3d(-100%, -80%, 0)' : translateString;
                translateString = $this.is('.eleven') ? 'translate3d(-40%, -120%, 0)' : translateString;
                $this.transition({
                    opacity: {
                        to: '0',
                        easing: 'easeOutExpo',
                        duration: 500
                    },
                    transform: {
                        to: translateString,
                        easing: 'easeOutExpo',
                        duration: 500
                    }
                }).then(function () {
                    $this.addClass('invisible');
                });
            });
            var $minutesSeconds = $clock.find('.minutes-seconds');
            $minutesSeconds.removeClass('invisible').each(function () {
                var $this = $(this);
                $this.transition({
                    opacity: {
                        to: '1',
                        easing: 'easeOutExpo',
                        duration: 500
                    },
                    transform: {
                        to: 'translate3d(0, 0, 0)',
                        easing: 'easeOutExpo',
                        duration: 500
                    }
                });
            });
            var $active = $time.find('.text-primary').removeClass('text-primary');
            $this.addClass('text-primary');
            setActiveClockNumber($this.text());
            if (($active.is($minutes) && !$this.is($minutes)) || ($active.is($seconds) && !$this.is($seconds))) {
                $minutesSeconds.each(function () {
                    var $this = $(this);
                    $this.transition({
                        transform: {
                            to: 'scale(0)',
                            easing: 'easeOutExpo',
                            duration: 400
                        }
                    }).then(function () {
                        $minutesSeconds.each(function () {
                            var $this = $(this);
                            $this.transition({
                                transform: {
                                    to: 'scale(1)',
                                    easing: 'easeOutExpo',
                                    duration: 400
                                }
                            });
                        });
                    });
                });
            }
        });

        $period.on('click', function () {
            var $this = $(this);
            var text = $this.text();
            if (text === 'AM') {
                $this.text('PM');
            }
            else {
                $this.text('AM');
            }
            $period.transition({
                transform: {
                    to: 'scale(0.8)',
                    easing: 'easeOutExpo',
                    duration: 200
                }
            }).then(function () {
                $period.transition({
                    transform: {
                        to: 'scale(1)',
                        easing: 'easeOutExpo',
                        duration: 200
                    }
                });
            });
        });

        $clockChildren.on('click', function () {
            var $this = $(this);
            $clockChildren.removeClass('text-primary');
            $this.addClass('text-primary');
            var text = $this.text();
            if (text !== '') {
                var $active = $time.find('.text-primary');
                if ($active.find('.first-number').length !== 0) {
                    $active.find('.first-number').text(text[0]);
                    $active.find('.second-number').text(text[1]);
                } else {
                    $active.text(text);
                }

            }
            if ($this.parent().is($exactTime)) {
                $keypad.removeClass('invisible').transition({
                    transform: {
                        from: 'scale(0)',
                        to: 'scale(1)',
                        ease: 'easeOutExpo',
                        duration: 200
                    }
                });
                $time.find('.text-primary').addClass('keypad-first');
            }
            else if ($hours.is('.text-primary')) {
                $minutes.trigger('click');
            }
            else if ($minutes.is('.text-primary')) {
                if ($seconds.is(':visible')) {
                    $seconds.trigger('click');
                }
            }
        });

        $am.on('click', function () {
            if ($period.text() !== 'AM') {
                $period.trigger('click');
            }
        });

        $pm.on('click', function () {
            if ($period.text() !== 'PM') {
                $period.trigger('click');
            }
        });

        $hr.on('click', function () {
            if (!$hours.is('.text-primary')) {
                $hours.trigger('click');
            }
        });

        $min.on('click', function () {
            if (!$minutes.is('.text-primary')) {
                $minutes.trigger('click');
            }
        });

        self.setTime(new Date());
    };
});