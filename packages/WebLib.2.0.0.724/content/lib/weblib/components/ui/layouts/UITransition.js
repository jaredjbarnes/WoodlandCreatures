BASE.require([
    "jQuery",
    "jQuery.fn.region",
    "jQuery.fn.transition",
    "BASE.async.Future"
], function () {
    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;

    components.ui.layouts.UITransition = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $outer = $(tags['outer']);
        var $inner = $(tags['inner']);
        var $transitionBlock = $inner.children().first();

        $transitionBlock.addClass('hide');

        var cleanSlate = function () {
            $outer.add($inner).removeAttr('style');
            $transitionBlock.css({
                position: '',
                top: '',
                left: '',
                bottom: '',
                right: '',
                marginRight: '',
                marginLeft: '',
                marginTop: '',
                marginBottom: '',
                opacity: ''
            });
            return $transitionBlock;
        };

        self.append = function (appendElement) {
            $inner.append(appendElement);
            $transitionBlock = $(appendElement);
            $transitionBlock.addClass('hide');
        };

        self.getRegion = function () {
            return $transitionBlock.region();
        };

        self.show = function (duration) {
            duration = (typeof duration === 'undefined') ? 0 : duration;
            return new Future(function (setValue, setError) {
                setTimeout(function () {
                    $transitionBlock.removeClass('hide').css({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 1,
                        visibility: 'visible'
                    });
                    setValue();
                }, duration);
            }).then();
        };

        self.hide = function (duration) {
            duration = (typeof duration === 'undefined') ? 0 : duration;
            return new Future(function (setValue, setError) {
                setTimeout(function () {
                    $transitionBlock.addClass('hide');
                    setValue();
                }, duration);
            }).then();
        };

        self.fadeOut = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().transition({
                opacity: {
                    to: 0,
                    duration: duration,
                    easing: easing
                }
            }).then(function(){
                $transitionBlock.addClass('hide');
            });
        }

        self.fadeIn = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return $transitionBlock.removeClass('hide').css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                opacity: {
                    from: 0,
                    to: 1,
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideInTop = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    from: 'translate3d(0,-100%,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutTop = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    to: 'translate3d(0,-100%,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function(){
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInBottom = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    from: 'translate3d(0,'+$inner.region().height+'px,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutBottom = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    to: 'translate3d(0,' + $inner.region().height + 'px,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function () {
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInLeft = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    from: 'translate3d(-100%,0,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutLeft = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    to: 'translate3d(-100%,0,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function () {
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInRight = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    from: 'translate3d(' + $inner.region().width + 'px,0,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutRight = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    to: 'translate3d(' + $inner.region().width + 'px,0,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function () {
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInTopCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate().removeClass('hide');
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    from: 'translate3d(0,-' + (($transitionBlock.region().height / 2) + ($outer.region().height / 2)) + 'px,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutTopCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate();
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    to: 'translate3d(0,-' + (($transitionBlock.region().height / 2) + ($outer.region().height / 2)) + 'px,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function(){
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInBottomCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate().removeClass('hide');
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    from: 'translate3d(0,' + (($transitionBlock.region().height / 2) + ($outer.region().height / 2)) + 'px,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutBottomCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate();
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    to: 'translate3d(0,' + (($transitionBlock.region().height / 2) + ($outer.region().height / 2)) + 'px,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function () {
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInLeftCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate().removeClass('hide');
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    from: 'translate3d(-' + (($transitionBlock.region().width / 2) + ($outer.region().width / 2)) + 'px,0,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutLeftCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate();
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    to: 'translate3d(-' + (($transitionBlock.region().width / 2) + ($outer.region().width / 2)) + 'px,0,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function(){
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInRightCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate().removeClass('hide');
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    from: 'translate3d(' + (($transitionBlock.region().width / 2) + ($outer.region().width / 2)) + 'px,0,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutRightCenter = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            cleanSlate();
            $outer.css({
                display: 'table'
            });
            $inner.css({
                display: 'table-cell',
                verticalAlign: 'middle',
            });
            return $transitionBlock.css({
                position: 'relative',
                top: 0,
                left: 0,
                margin: '0 auto'
            }).transition({
                transform: {
                    to: 'translate3d(' + (($transitionBlock.region().width / 2) + ($outer.region().width / 2)) + 'px,0,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function () {
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInBottomStayAtBottom = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                bottom: 0,
                left: 0
            }).transition({
                transform: {
                    from: 'translate3d(0,100%,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutBottomStayAtBottom = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                bottom: 0,
                left: 0
            }).transition({
                transform: {
                    to: 'translate3d(0,100%,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function(){
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInRightStayAtRight = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                top: 0,
                right: 0
            }).transition({
                transform: {
                    from: 'translate3d(100%,0,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutRightStayAtRight = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                top: 0,
                right: 0
            }).transition({
                transform: {
                    to: 'translate3d(100%,0,0)',
                    duration: duration,
                    easing: easing
                }
            }).then(function(){
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInLeftSoft = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    from: 'translate3d(-30%,0,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                },
                opacity: {
                    from: 0,
                    to: 1,
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutLeftSoft = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    to: 'translate3d(-30%,0,0)',
                    duration: duration,
                    easing: easing
                },
                opacity: {
                    to: 0,
                    duration: duration,
                    easing: easing
                }
            }).then(function () {
                $transitionBlock.addClass('hide');
            });
        };

        self.slideInRightSoft = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().removeClass('hide').css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    from: 'translate3d('+ ($outer.region().width * .3) +'px,0,0)',
                    to: 'translate3d(0,0,0)',
                    duration: duration,
                    easing: easing
                },
                opacity: {
                    from: 0,
                    to: 1,
                    duration: duration,
                    easing: easing
                }
            });
        };

        self.slideOutRightSoft = function (options, easing) {
            var duration;
            if (typeof options === 'object') {
                easing = options.easing;
                duration = options.duration;
            } else {
                duration = options;
                console.log('Please use an object with {duration: 100, easing: "easeOutExpo"}, passing in a number is deprecated.')
            }
            return cleanSlate().css({
                position: 'absolute',
                top: 0,
                left: 0
            }).transition({
                transform: {
                    to: 'translate3d(' + ($outer.region().width * .3) + 'px,0,0)',
                    duration: duration,
                    easing: easing
                },
                opacity: {
                    to: 0,
                    duration: duration,
                    easing: easing
                }
            }).then(function(){
                $transitionBlock.addClass('hide');
            });
        };
    };
});