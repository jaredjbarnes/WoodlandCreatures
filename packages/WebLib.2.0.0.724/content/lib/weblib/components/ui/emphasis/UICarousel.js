BASE.require([
    "jQuery",
    "jQuery.fn.transition",
    "jQuery.fn.isAnimating"
], function () {
    BASE.namespace("components.ui.emphasis");

    components.ui.emphasis.UICarousel = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $carousel = $(tags['carousel']);
        var $carouselInner = $(tags['carousel-inner']);
        var $carouselLeft = $(tags['carousel-left']);
        var $carouselRight = $(tags['carousel-right']);
        var $current = null;
        var isSwipeable = false;
        var start = 0;
        var move = 0;
        var reset = {
            transform: {
                to: 'translate3d(0,0,0)',
                duration: 0,
                easing: 'linear'
            }
        }

        var hideArrows = function () {
            $carouselLeft.add($carouselRight).addClass('hide');
        }

        var showArrows = function () {
            $carouselLeft.add($carouselRight).removeClass('hide');
        }

        var updateState = function () {
            if ($current === null) {
                $current = $carouselInner.children(':first-child').addClass('current');
            }
            if ($carouselInner.children().length >= 2) {
                isSwipeable = true;
                showArrows();
            }
            else {
                isSwipeable = false;
                hideArrows();
            }
        }

        var wrap = function (elem) {
            return $(elem).wrap('<div class="carousel-item"></div>');
        }

        wrap($carouselInner.children());
        updateState();

        self.skin = function (options) {
            var fontColor; 
            if (options) {
                $carousel.css({
                    'cssText': 'background-color:' + (options.backgroundColor || '#fafafa') +  '!important'
                });
                $carouselLeft.add($carouselRight).css({
                    'cssText': 'background-color:' + (options.arrowBackgroundColor || '#fff') + ';color:' + (options.arrowColor || '#777777')
                }).mouseenter(function () {
                    $this = $(this);
                    fontColor = $this.css('color');
                    $this.css('color', options.arrowHoverColor || '#333');
                }).mouseleave(function () {
                    $this.css('color', fontColor);
                });
                
            }
        }

        self.append = function (elem) {
            $carouselInner.append(wrap(elem));
            updateState();
        }

        self.appendComponent = function (options) {
            if (options !== undefined && options !== null) {
                BASE.web.components.createComponent(options.component, options.componentContent, options.componentAttributes).then(function (component) {
                    self.append(component);
                    $(component).find("[component]").addBack().triggerHandler('enteredView');
                });
            }
        }
        
        self.swipeLeft = function () {
            if (!$current.isAnimating()) {
                var transform = {
                    transform: {
                        to: 'translate3d(100%,0,0)',
                        duration: 600,
                        easing: 'easeOutExpo'
                    }
                }
                if (isSwipeable) {
                    var $prev = null;
                    if ($current.prev().length === 1) {
                        $prev = $current.prev();
                    }
                    else {
                        $prev = $carouselInner.children(':last-child');
                    }
                    var oldView = $current.children(':first-child')[0];
                    var newView = $prev.children(':first-child')[0];
                    $elem.trigger({
                        type: 'changeStart',
                        oldView: oldView,
                        newView: newView
                    });
                    $current.transition(transform);
                    $prev.addClass('previous').transition(transform).then(function () {
                        $current.removeClass('current').transition(reset);
                        $current = $prev.addClass('current').removeClass('previous');
                        $current.transition(reset).then(function(){;
                            $elem.trigger({
                                type: 'changeEnd',
                                oldView: oldView,
                                newView: newView
                            });
                        })
                    });
                }
            }
        }

        self.swipeRight = function () {
            if (!$current.isAnimating()) {
                var transform = {
                    transform: {
                        to: 'translate3d(-100%,0,0)',
                        duration: 600,
                        easing: 'easeOutExpo'
                    }
                }
                if (isSwipeable) {
                    var $next = null;
                    if ($current.next().length === 1) {
                        $next = $current.next();
                    }
                    else {
                        $next = $carouselInner.children(':first-child');
                    }
                    var oldView = $current.children(':first-child')[0];
                    var newView = $next.children(':first-child')[0];
                    $elem.trigger({
                        type: 'changeStart',
                        oldView: oldView,
                        newView: newView
                    });
                    $current.transition(transform);
                    $next.addClass('next').transition(transform).then(function () {
                        $current.removeClass('current').transition(reset);
                        $current = $next.addClass('current').removeClass('next');
                        $current.transition(reset).then(function () {;
                            $elem.trigger({
                                type: 'changeEnd',
                                oldView: oldView,
                                newView: newView
                            });
                        });
                    });
                }
            }
        }

        $carouselLeft.on('click', self.swipeLeft);

        $carouselRight.on('click', self.swipeRight);

        $carouselInner.children().on('touchstart', function (event) {
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            start = originalEventChangedTouch.pageX;
        });

        $carouselInner.on('touchmove', function (event) {
            event.preventDefault();
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            move = originalEventChangedTouch.pageX;
            var translateAmount = -(start - move);

            if (!$current.isAnimating()) {
                if (translateAmount >= 10) {
                    self.swipeLeft();
                }
                else if (translateAmount <= -10) {
                    self.swipeRight();
                }
            }
        });
    };
});
