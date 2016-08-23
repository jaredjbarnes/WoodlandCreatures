BASE.require([
    "jQuery"
], function () {

    BASE.namespace("components.ui.layouts");
 
    components.ui.layouts.UISectionSlideYAxisBehavior = function (elem) {
        var self = this;
        var $elem = $(elem);
        var isTouchEnded = true;
        var isVertical = false;
        var isHorizontal = false;
        var startX = 0;
        var moveX = 0;
        var endX = 0;
        var startY = 0;
        var moveY = 0;
        var endY = 0;
        var touchIdentifier = 0;
        var lastMove = 0;
        var startTime = 0;
        var endTime = 0;
        var threshold = 10;

        $elem.on('touchstart', function (event) {
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            if (isTouchEnded) {
                isTouchEnded = false;
                touchIdentifier = originalEventChangedTouch.identifier
                startX = originalEventChangedTouch.pageX;
                startY = originalEventChangedTouch.pageY;
                startTime = new Date().getTime();
                lastMove = startY;
                isVertical = false;
                isHorizontal = false;
            }
        });

        
        $elem.on('touchmove', function (event) {
            event.preventDefault();
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            if (originalEventChangedTouch.identifier === touchIdentifier) {
                moveX = originalEventChangedTouch.pageX;
                moveY = originalEventChangedTouch.pageY;
                var totalX = moveX - startX;
                var totalY = moveY - startY;
                var change = lastMove - moveY;
                var scroll = $elem.scrollTop() + change;
                if (!isVertical && !isHorizontal) {
                    event.stopPropagation();
                    if (Math.abs(totalY) >= threshold) {
                        isVertical = true;
                    }
                    if (Math.abs(totalX) >= threshold) {
                        isHorizontal = true;
                    }
                }
                if (isVertical) {
                    event.stopPropagation();
                    $elem.scrollTop(scroll);
                }
                lastMove = moveY;   
            }
        });
        $elem.on('touchend', function (event) {
            var originalEventChangedTouch = event.originalEvent.changedTouches[0];
            if (originalEventChangedTouch.identifier === touchIdentifier) {
                endX = originalEventChangedTouch.pageX;
                endY = originalEventChangedTouch.pageY;
                endTime = new Date().getTime();
                if ((endTime - startTime) < 300) {
                    if (isVertical) {
                        var change = startY - endY;
                        var scrollTop = $elem.scrollTop();
                        var animateTo = scrollTop + (change * 2.5);
                        $elem.animate({ 'scrollTop': animateTo }, 200);
                        lastMove = animateTo;    
                    }
                }
                isTouchEnded = true;
            }
        }); 
    };

});