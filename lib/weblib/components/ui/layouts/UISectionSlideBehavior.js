BASE.require([
    "jQuery",
    "BASE.async.Future",
    "jQuery.support.transition"
], function () {

    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;

    var SectionSlideManager = function ($sections, $firstChild) {
        var self = this;
        var currentMargin = 0;
        var start = 0;
        var move = 0;
        var end = 0;
        var isTouchEnded = true;
        var touchIdentifier = 0;
        var $active = $firstChild;
        var isResize = false;

        $firstChild.css({
            transition: 'margin-left 0.7s cubic-bezier(0.190,1,0.220,1)',
            transform: "translate3d(0,0,0)"
        });

        $(window).on('resize', function () {
            isResize = true;
            self.setPosition($active.index());
        });

        $sections.on('touchstart', function (event) {
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            if (isTouchEnded) {
                isTouchEnded = false;
                touchIdentifier = originalEventChangedTouch.identifier
                start = originalEventChangedTouch.pageX;
            }
        });

        $sections.on('touchmove', function (event) {
            event.preventDefault();
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            if (originalEventChangedTouch.identifier === touchIdentifier) {
                move = originalEventChangedTouch.pageX;

                var $prev = $active.prev();
                var $next = $active.next();

                var marginLeft = -(start - move);

                if (marginLeft >= 100 && $prev.length > 0) {
                    self.setPosition($prev.index());
                }
                else if (marginLeft <= -100 && $next.length > 0) {
                    self.setPosition($next.index());
                }
                else if (marginLeft >= 100) {
                    marginLeft = 100;
                }
                else if (marginLeft <= -100) {
                    marginLeft = -100;
                }
                else if ($prev.length === 0 && marginLeft > 0) {
                    $active.css({
                        transform: 'perspective( ' + ($active.outerHeight() + 100) + 'px ) rotateY( ' + (marginLeft / 10) + 'deg )',
                        opacity: 1 - (marginLeft / 200)
                    });
                }
                else if ($next.length === 0 && marginLeft < 0) {
                    $active.css({
                        transform: 'perspective( ' + ($active.outerHeight() + 100) + 'px ) rotateY( -' + (Math.abs(marginLeft) / 10) + 'deg )',
                        opacity: 1 - (Math.abs(marginLeft) / 200)
                    });
                }
                else {
                    $firstChild.css('margin-left', currentMargin + marginLeft);
                }
            }
        });

        $sections.on('touchend', function (event) {
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            if (originalEventChangedTouch.identifier === touchIdentifier) {
                end = originalEventChangedTouch.pageX;
                isTouchEnded = true;
                $active.css({
                    transform: 'rotateY(0deg)',
                    opacity: 1
                });
                self.setPosition($active.index());
            }
        });

        self.setPosition = function (position) {
            touchIdentifier = false;
            isTouchEnded = true;
            var $moveToElem = $firstChild.parent().children().eq(position);
            var moveMargin = 0;
            var isTriggerEvents = true;

            if ($active.index() > position) {
                moveMargin = $moveToElem.outerWidth();
                $active.prevUntil($moveToElem).each(function () {
                    moveMargin += $(this).outerWidth();
                });
            }
            else if ($active.index() < position) {
                moveMargin = $active.outerWidth();
                $active.nextUntil($moveToElem).each(function () {
                    moveMargin += $(this).outerWidth();
                });
                moveMargin = moveMargin * -1;
            }
            else {
                if (isResize) {
                    $active = $firstChild;
                    currentMargin = 0;
                    isResize = false;
                    self.setPosition(position); 
                }
                isTriggerEvents = false;
            }
            currentMargin = currentMargin + moveMargin;
            if (isTriggerEvents) {
                $sections.trigger({
                    type: 'startSlide',
                    currentPosition: $active.index(),
                    toPosition: $moveToElem.index()
                });
            }
            $active = $moveToElem;
            return new Future(function (setValue, setError) {
                $firstChild.css({
                    marginLeft: currentMargin + 'px'
                });
                if ($.support.transition) {
                    $firstChild.on('transitionend webkitTransitionEnd', function () {
                        setValue(isTriggerEvents);
                        $firstChild.off('transitionend webkitTransitionEnd');
                    });
                }
                else {
                    setValue(isTriggerEvents);
                }
                
            }).then(function (isChanged) {
                if (isChanged) {
                    $sections.trigger({
                        type: 'change',
                        position: $active.index()
                    });
                }
            });
        }

        self.getPosition = function () {
            return $active.index();
        }
    };

   
    components.ui.layouts.UISectionSlideBehavior = function (elem) {
        var self = this;
        var $elem = $(elem);

        $elem.data('sectionSlide', self);

        self.createSectionSlide = function ($firstChild) {
            return new Future(function (setValue, setError) {
                var sectionSlideManager = {};
                SectionSlideManager.call(sectionSlideManager, $elem, $firstChild);
                setValue(sectionSlideManager);
            });
        };
    };

});